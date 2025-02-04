/**
 * @file
 * Field Display Manager behaviors.
 */
(function ($, Drupal, once) {

  'use strict';

  /**
   * Callback used in {@link Drupal.behaviors.fieldDisplayManagerManageDisplay}.
   */
  Drupal.toggleButtons = () =>
    `<div class="manage-display-toggle-wrapper" data-drupal-selector="manage-display-toggle-wrapper" style="display: inline-block;">
      <input type="radio" id="display-toggle-enable-all" name="manage_display_toggle" value="enable_all">
      <label for="display-toggle-enable-all">${Drupal.t('Enable all fields')}</label>
      <input type="radio" id="display-toggle-disable-all" name="manage_display_toggle" value="disable_all">
      <label for="display-toggle-disable-all">${Drupal.t('Disable all fields')}</label>
    </div>`;

  Drupal.behaviors.fieldDisplayManagerManageDisplay = {
    attach (context, settings) {

      /**
       * Update the region dropdown of all fields.
       *
       * @param {string} region
       *   Name of region.
       */
      function toggleFields(region) {
        $("select.field-region", context).each(function () {
          $(this).val(region).trigger("change");
        });
      }

      /**
       * Update field weights in the given region.
       *
       * @param {string} region
       *   Name of region.
       */
      function updateFieldWeights(region) {
        const table = $("#field-display-overview");
        // The minimum weight.
        let weight = 0;
        // Update the field weights.
        table
          .find(`.region-${region}-message`)
          .nextUntil(".region-title")
          .find("input.field-weight")
          .each(function () {
            this.value = weight;
            ++weight;
          });
      }

      const $wrapper = $(once("tabledragToggle", ".tabledrag-toggle-weight-wrapper", context));
      const $button = $wrapper.find("button.tabledrag-toggle-weight");
      if ($button.length == 1) {
        const $radios = $(Drupal.toggleButtons());
        // Insert the radio buttons.
        $button.before($radios);

        // Attach change event.
        $radios.find('input[type="radio"]').on('change',
          function(e) {
            const $disabledRegion = $(".entity-view-display-edit-form tr.region-hidden-message");
            const $enabledRegion = $(".entity-view-display-edit-form tr.region-content-message")
            if ('disable_all' == e.target.value) {
              // Disable all fields.
              const $enabledFields = $enabledRegion.nextUntil(".region-hidden-title", ".tabledrag-leaf");
              if ($enabledFields.length) {
                $disabledRegion.after($enabledFields);
                $disabledRegion.removeClass("region-empty").addClass("region-populated");
                $enabledRegion.removeClass("region-populated").addClass("region-empty");
                toggleFields('hidden');
                updateFieldWeights('hidden');
              }
            } else if ('enable_all' == e.target.value) {
              // Enable all fields.
              const $disbledFields = $disabledRegion.nextUntil();
              if ($disbledFields.length) {
                $enabledRegion.after($disbledFields);
                $enabledRegion.removeClass("region-empty").addClass("region-populated");
                $disabledRegion.removeClass("region-populated").addClass("region-empty");
                toggleFields('content');
                updateFieldWeights("content");
              }
            }
          }
        )
      }
    }
  };

} (jQuery, Drupal, once));
