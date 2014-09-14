<?php
/**
 * Plugin element to store the user's IP address
 *
 * @package     Joomla.Plugin
 * @subpackage  Fabrik.element.ip
 * @copyright   Copyright (C) 2005-2013 fabrikar.com - All rights reserved.
 * @license     GNU/GPL http://www.gnu.org/copyleft/gpl.html
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

/**
 * Plugin element to store the user's IP address
 *
 * @package     Joomla.Plugin
 * @subpackage  Fabrik.element.ip
 * @since       3.0
 */

class PlgFabrik_ElementIp extends PlgFabrik_Element
{
	/**
	 * Draws the html form element
	 *
	 * @param   array  $data           to pre-populate element with
	 * @param   int    $repeatCounter  repeat group counter
	 *
	 * @return  string	elements html
	 */

	public function render($data, $repeatCounter = 0)
	{
		$app = JFactory::getApplication();
		$element = $this->getElement();
		$name = $this->getHTMLName($repeatCounter);
		$id = $this->getHTMLId($repeatCounter);
		$params = $this->getParams();

		$rowid = $app->input->get('rowid', false);
		/**
		 * @TODO when editing a form with joined repeat group the rowid will be set but
		 * the record is in fact new
		 */

		if ($params->get('ip_update_on_edit') || !$rowid || ($this->inRepeatGroup && $this->_inJoin && $this->_repeatGroupTotal == $repeatCounter))
		{
			$ip = $_SERVER['REMOTE_ADDR'];
		}
		else
		{
			if (empty($data) || empty($data[$name]))
			{
				// If $data is empty, we must (?) be a new row, so just grab the IP
				$ip = $_SERVER['REMOTE_ADDR'];
			}
			else
			{
				$ip = $this->getValue($data, $repeatCounter);
			}
		}

		$str = '';

		if ($this->canView())
		{
			if (!$this->isEditable())
			{
				$str = $ip;
			}
			else
			{
				$str = '<input type="text" class="fabrikinput inputbox" readonly="readonly" name="' . $name . '" id="' . $id . '" value="' . $ip . '" />';
			}
		}
		else
		{
			// Make a hidden field instead
			$str = '<input type="hidden" class="fabrikinput" name="' . $name . '" id="' . $id . '" value="' . $ip . '" />';
		}

		return $str;
	}

	/**
	 * Trigger called when a row is stored.
	 * If we are creating a new record, and the element was set to readonly
	 * then insert the users data into the record to be stored
	 *
	 * @param   array  &$data          Data to store
	 * @param   int    $repeatCounter  Repeat group index
	 *
	 * @return  bool  If false, data should not be added.
	 */

	public function onStoreRow(&$data, $repeatCounter = 0)
	{
		if (!parent::onStoreRow($data, $repeatCounter))
		{
			return false;
		}

		$element = $this->getElement();
		$formModel = $this->getFormModel();
		$formData = $formModel->formData;

		if (JArrayHelper::getValue($formData, 'rowid', 0) == 0 && !in_array($element->name, $data))
		{
			$data[$element->name] = $_SERVER['REMOTE_ADDR'];
		}
		else
		{
			$params = $this->getParams();

			if ($params->get('ip_update_on_edit', 0))
			{
				$data[$element->name] = $_SERVER['REMOTE_ADDR'];
				$data[$element->name . '_raw'] = $_SERVER['REMOTE_ADDR'];
			}
		}

		return true;
	}

	/**
	 * This really does get just the default value (as defined in the element's settings)
	 *
	 * @param   array  $data  form data
	 *
	 * @return mixed
	 */

	public function getDefaultValue($data = array())
	{
		if (!isset($this->default))
		{
			$this->default = $_SERVER['REMOTE_ADDR'];
		}

		return $this->default;
	}

	/**
	 * Determines the value for the element in the form view
	 *
	 * @param   array  $data           form data
	 * @param   int    $repeatCounter  when repeating joined groups we need to know what part of the array to access
	 * @param   array  $opts           options
	 *
	 * @return  string	value
	 */

	public function getValue($data, $repeatCounter = 0, $opts = array())
	{
		// Kludge for 2 scenarios
		if (array_key_exists('rowid', $data))
		{
			// When validating the data on form submission
			$key = 'rowid';
		}
		else
		{
			// When rendering the element to the form
			$key = '__pk_val';
		}

		if (empty($data) || !array_key_exists($key, $data) || (array_key_exists($key, $data) && empty($data[$key])))
		{
			$value = $this->getDefaultOnACL($data, $opts);

			return $value;
		}

		$res = parent::getValue($data, $repeatCounter, $opts);

		return $res;
	}
}
