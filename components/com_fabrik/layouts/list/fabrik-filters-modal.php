<?php
/**
 * Layout: List filters
 *
 * @package     Joomla
 * @subpackage  Fabrik
 * @copyright   Copyright (C) 2005-2015 fabrikar.com - All rights reserved.
 * @license     GNU/GPL http://www.gnu.org/copyleft/gpl.html
 * @since       3.4
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

use Fabrik\Helpers\Html;
use Joomla\CMS\Language\Text;

$d = $displayData;

$cols = array();
foreach ($d->filters as $key => $filter) :
	if ($key !== 'all') :
		$required = $filter->required == 1 ? ' notempty' : '';
		$col      = '<div data-filter-row="' . $key . '" class="fabrik_row oddRow' . $required . '">';
		$col .= $filter->label . '<br />' . $filter->element;
		$col .= '</div>';
		$cols[] = $col;
	endif;
endforeach;

$showClearFilters = false;
foreach ($d->filters as $key => $filter) :
	if ($filter->displayValue !== '') :
		$showClearFilters = true;
	endif;
endforeach;

?>
<div data-modal-state-container style="display:<?php echo $showClearFilters ? '' : 'none'; ?>">
	<?php echo Text::_('COM_FABRIK_FILTERS_ACTIVE'); ?>
	<span data-modal-state-display>
	<?php $layout = Html::getLayout('list.fabrik-filters-modal-state-label');

	foreach ($d->filters as $key => $filter) :
		if ($filter->displayValue !== '') :

			$layoutData = (object) array(
				'label' => $filter->label,
				'displayValue' => $filter->displayValue,
				'key' => $key
			);
			echo $layout->render($layoutData);
		endif;
	endforeach;
	?>
	</span>
</div>
<div class="fabrikFilterContainer modal fade" id="filter_modal">

	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header container">
				<div class="row">
					<div class="col ps-1"><h3><?php echo Html::icon('icon-filter', Text::_('COM_FABRIK_FILTER')); ?></h3></div>
					<div class="col pe-1"><button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">&times;</button></div>
				</div>
			</div>
			<div class="modal-body">
				<div class="container-fluid">
					<div class="row">
						<?php
						echo implode("\n", Html::bootstrapGrid($cols, $d->filterCols));
						?>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<?php
				if ($d->showClearFilters) :
					$clearFiltersClass = $d->gotOptionalFilters ? "btn btn-warning clearFilters hasFilters" : "btn btn-warning clearFilters";
				?>
					<input type="button" class="<?php echo $clearFiltersClass; ?>"
						value="<?php echo Text::_('COM_FABRIK_CLEAR'); ?>" />
				<?php endif ?>
				<?php
				if ($d->filter_action != 'onchange') :
					?>
					<input type="button" data-bs-dismiss="modal" class="btn btn-primary fabrik_filter_submit"
						value="<?php echo Text::_('COM_FABRIK_GO'); ?>" name="filter">
					<?php
				endif;
				?>
			</div>
		</div>

	</div>

</div>
