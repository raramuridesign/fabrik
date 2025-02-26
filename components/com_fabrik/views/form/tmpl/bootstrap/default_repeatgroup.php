<?php
/**
 * Bootstrap Form Template: Repeat group rendered as standard form
 *
 * @package     Joomla
 * @subpackage  Fabrik
 * @copyright   Copyright (C) 2005-2020  Media A-Team, Inc. - All rights reserved.
 * @license     GNU/GPL http://www.gnu.org/copyleft/gpl.html
 * @since       3.0
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

use Joomla\CMS\Factory;

$input = Factory::getApplication()->input;
$group = $this->group;
$i = 1;
$w = new FabrikWorker;

foreach ($group->subgroups as $subgroup) :
	$introData = array_merge($input->getArray(), array('i' => $i));
	?>
	<div class="fabrikSubGroup">
		<div data-role="group-repeat-intro">
			<?php echo $w->parseMessageForPlaceHolder($group->repeatIntro, $introData);?>
		</div>
	<?php
		// Add the add/remove repeat group buttons
		if ($group->editable && ($group->canAddRepeat || $group->canDeleteRepeat)) : ?>
			<div class="fabrikGroupRepeater pull-right btn-group">
				<?php if ($group->canAddRepeat) :
					echo $this->addRepeatGroupButton;
				endif;
				if ($group->canDeleteRepeat) :
					echo $this->removeRepeatGroupButton;
				endif;?>
			</div>
		<?php
		endif;
		?>
		<div class="fabrikSubGroupElements">
			<?php

			// Load each group in a <ul>
			$this->elements = $subgroup;
			echo $this->loadTemplate('group');
			?>
		</div><!-- end fabrikSubGroupElements -->
	</div><!-- end fabrikSubGroup -->
	<?php
	$i ++;
endforeach;
