<?php
/**
 * Fabrik: Installer Manifest Class
 *
 * @package     Joomla
 * @subpackage  Fabrik
 * @author      Henk
 * @license     GNU/GPL http://www.gnu.org/copyleft/gpl.html
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

use Joomla\CMS\Filesystem\File;
use Joomla\CMS\Filesystem\Folder;
use Joomla\Utilities\ArrayHelper;
use Joomla\CMS\Factory;

class Com_FabrikInstallerScript
{
	/**
	 * Run before installation or upgrade run
	 *
	 * @param   string $type   discover_install (Install unregistered extensions that have been discovered.)
	 *                         or install (standard install)
	 *                         or update (update)
	 * @param   object $parent installer object
	 *
	 * @return  void
	 */
	public function preflight($type, $parent)
	{
		if (version_compare(JVERSION, '4.1.5', '<')) {
			throw new RuntimeException('Fabrik can not be installed on versions of Joomla older than 4.1.5');
			return false;
		}
		if (version_compare(JVERSION, '5.0.0', '>')) {
			throw new RuntimeException('Fabrik can not yet be installed on Joomla 5');
			return false;
		}
		// Remove fabrik from library if exist
		$path = JPATH_LIBRARIES.'/fabrik';		
		if(Folder::exists($path)) Folder::delete($path);

		// Check for correct database version
		// Hate prepare statements, always give me trouble
		$prefix = Factory::getApplication()->getCfg('dbprefix');
		$db = Factory::getDbo();
		$query = $db->getQuery(true);
		$query = "SELECT `extension_id` FROM `".$prefix."extensions` WHERE `element` = 'com_fabrik';";
		$db->setQuery($query);
		$id = $db->loadResult();
		if(!empty($id)) { 
			$query = "SELECT `version_id` FROM `".$prefix."schemas` WHERE `extension_id` = '".$id."';";
			$db->setQuery($query);
			$version = $db->loadResult();
			if($version == '3.6.1') {
				$query = "UPDATE `".$prefix."schemas` SET `version_id` = '3.10' WHERE `extension_id` = '".$id."';";
				$db->setQuery($query);
				$db->execute();
			}
		}
	}

	/**
	 * Run when the component is installed
	 *
	 * @param   object $parent installer object
	 *
	 * @return bool
	 */
	public function install($parent)
	{
		$parent->getParent()->setRedirectURL('index.php?option=com_fabrik');

		return true;
	}

	/**
	 * Run when the component is updated
	 *
	 * @param   object $parent installer object
	 *
	 * @return  bool
	 */
	public function update($parent)
	{
		// Needs revision. Deprecated plugins already uninstalled in 3.10 or earlier. Do we have other deprecated ?
		$db    = Factory::getDbo();
		$query = $db->getQuery(true);
		$app   = Factory::getApplication();
		$msg = array();

		// Uninstalled plugins.
		$plugins = array(
			'fabrik_element' => array('fbactivityfeed', 'fblikebox', 'fbrecommendations'),
			'fabrik_form' => array('vbforum')
		);

		// Deprecated - 'timestamp', 'exif'
		$query->select('*')->from('#__extensions');

		foreach ($plugins as $folder => $plugs)
		{
			$query->where('(folder = ' . $db->q($folder) . ' AND element IN (' . implode(', ', $db->q($plugs)) . '))', 'OR');

			foreach ($plugs as $plug)
			{
				$path = JPATH_PLUGINS . '/' . $folder . '/' . $plug;

				if (Folder::exists($path))
				{
					Folder::delete($path);
				}
			}
		}

		$deprecatedPlugins = $db->setQuery($query)->loadObjectList();

		if (!empty($deprecatedPlugins))
		{
			$ids = ArrayHelper::getColumn($deprecatedPlugins, 'extension_id');
			$ids = ArrayHelper::toInteger($ids);

			$query->clear()->delete('#__extensions')->where('extension_id IN ( ' . implode(',', $ids) . ')');
			$db->setQuery($query)->execute();

			// Un-publish elements
			$query->clear()->select('id, name, label')->from('#__fabrik_elements')
				->where('plugin IN (' . implode(', ', $db->q($plugins['fabrik_element'])) . ')')
				->where('published = 1');
			$db->setQuery($query);
			$unpublishedElements = $db->loadObjectList();
			$unpublishedIds      = ArrayHelper::getColumn($unpublishedElements, 'id');

			if (!empty($unpublishedIds))
			{
				$msg[] = 'The following elements have been unpublished as their plug-ins have been uninstalled. : ' . implode(', ', $unpublishedIds);
				$query->clear()
					->update('#__fabrik_elements')->set('published = 0')->where('id IN (' . implode(',', $db->q($unpublishedIds)) . ')');
				$db->setQuery($query)->execute();
			}
		}

		// Un-publish form plug-ins. Maybe do this for more plugins ?
		$query->clear()->select('id, params')->from('#__fabrik_forms');
		$forms = $db->setQuery($query)->loadObjectList();
		foreach ($forms as $form)
		{
			$params = json_decode($form->params);
			$found = false;

			if (isset($params->plugins))
			{
				for ($i = 0; $i < count($params->plugins); $i++)
				{
					if (in_array($params->plugins[$i], $plugins['fabrik_form']))
					{
						$msg[]                    = 'Form ' . $form->id . '\'s plugin \'' . $params->plugins[$i] .
							'\' has been unpublished';
						$params->plugin_state[$i] = 0;
						$found = true;
					}
				}

				if ($found)
				{
					$query->clear()->update('#__fabrik_forms')->set('params = ' . $db->q(json_encode($params)))
						->where('id = ' . (int) $form->id);

					$db->setQuery($query)->execute();
				}
			}
		}

		if (!empty($msg))
		{
			$app->enqueueMessage(implode('<br>', $msg), 'warning');
		}

		return true;
	}

	/**
	 * Run when the component is uninstalled.
	 *
	 * @param   object $parent installer object
	 *
	 * @return  void
	 */
	public function uninstall($parent)
	{
	}

	/**
	 * Run after installation or upgrade run
	 *
	 * @param   string $type   discover_install (Install unregistered extensions that have been discovered.)
	 *                         or install (standard install)
	 *                         or update (update)
	 * @param   object $parent installer object
	 *
	 * @return  bool
	 */
	public function postflight($type, $parent)
	{
		$db    = Factory::getDbo();
		$query = $db->getQuery(true);
/* We have no updatesite yet
		// Remove update site
		$where = "location LIKE '%update/component/com_fabrik%' OR location = 'http://fabrikar.com/update/fabrik/package_list.xml'";
		$query->delete('#__update_sites')->where($where);
		$db->setQuery($query);

		if (!$db->execute())
		{
			echo "<p>didnt remove old update site</p>";
		}
		else
		{
			echo "<p style=\"color:green\">removed old update site</p>";
		}
*/
		if ($type !== 'uninstall')
		{
			$query->clear();
			$query->update('#__extensions')->set('enabled = 1')
				->where('type = ' . $db->q('plugin') . ' AND (folder LIKE ' . $db->q('fabrik_%'), 'OR')
				->where('(folder=' . $db->q('system') . ' AND element = ' . $db->q('fabrik') . ')', 'OR')
				->where('(folder=' . $db->q('content') . ' AND element = ' . $db->q('fabrik') . '))', 'OR');
			$db->setQuery($query)->execute();
			$this->fixMenuComponentId();
		}

		if ($type !== 'update' && $type !== 'uninstall')
		{
			if (!$this->setConnection())
			{
				echo "<p style=\"color:red\">Didn't set connection. Aborting installation</p>";
				exit;

				return false;
			}
			echo "<p style=\"color:green\">Default connection created</p>";
		}

		if ($type !== 'update')
		{
			if (!$this->setDefaultProperties())
			{
				echo "<p>couldnt set default properties</p>";
				exit;

				return false;
			}
		}

		if ($type == 'uninstall') {
			// Remove empty folders if exist
			$path = JPATH_ROOT.'/media/com_fabrik';		
			if(Folder::exists($path)) Folder::delete($path);
			$path = JPATH_ROOT.'/plugins/fabrik_element';		
			if(Folder::exists($path)) Folder::delete($path);
		}

		if ($type !== 'uninstall') {
			echo "<p>Installation finished</p>";
		}
	}

	/**
	 * Check if there is a connection already installed if not create one
	 * by copying over the site's default connection
	 *
	 * @return  bool
	 */
	protected function setConnection()
	{
		$db               = Factory::getDbo();
		$app              = Factory::getApplication();
		$row              = new stdClass;
		$row->host        = $app->get('host');
		$row->user        = $app->get('user');
		$row->password    = $app->get('password');
		$row->database    = $app->get('db');
		$row->description = 'site database';
		$row->params      = '';
		$row->checked_out = 0;
		$row->published   = 1;
		$row->default     = 1;
		$res              = $db->insertObject('#__fabrik_connections', $row, 'id');

		return $res;
	}

	/**
	 * Test to ensure that the main component params have a default setup
	 *
	 * @return  bool
	 */
	protected function setDefaultProperties()
	{
		$db    = Factory::getDbo();
		$query = $db->getQuery(true);
		$query->select('extension_id, params')->from('#__extensions')
			->where('name = ' . $db->q('fabrik'))
			->where('type = ' . $db->q('component'));
		$db->setQuery($query);
		$row                                 = $db->loadObject();
		$opts                                = new stdClass;
		$opts->fbConf_wysiwyg_label          = 0;
		$opts->fbConf_alter_existing_db_cols = 0;
		$opts->spoofcheck_on_formsubmission  = 0;

		if ($row && ($row->params == '{}' || $row->params == ''))
		{
			$json  = $row->params;
			$query = $db->getQuery(true);
			$query->update('#__extensions')->set('params = ' . $db->quote($json))
				->where('extension_id = ' . (int) $row->extension_id);
			$db->setQuery($query);

			if (!$db->execute())
			{
				return false;
			}
		}

		return true;
	}

	/**
	 * Does this still apply in 4.0 ?
	 * God knows why but install component, uninstall component and install
	 * again and component_id is set to 0 for the menu items
	 *
	 * @return  bool
	 */
	protected function fixMenuComponentId()
	{
		$db    = Factory::getDbo();
		$query = $db->getQuery(true);
		$query->select('extension_id')->from('#__extensions')->where('element = ' . $db->q('com_fabrik'));
		$db->setQuery($query);
		$id = (int) $db->loadResult();
		$query->clear();
		$query->update('#__menu')->set('component_id = ' . $id)->where('path LIKE ' . $db->q('fabrik%'));

		return $db->setQuery($query)->execute();
	}
}
