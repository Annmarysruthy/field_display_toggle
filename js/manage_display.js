/**
 * @file
 * Field Display Manager behaviors.
 */
(function ($, Drupal, once) {

  'use strict';

  Drupal.behaviors.fieldDisplayManagerManageDisplay = {
    attach (context, settings) {
      // Create the radio buttons.
      Drupal.theme.manageDisplayToggle = () =>
        `<div class="manage-display-toggle-wrapper" data-drupal-selector="manage-display-toggle-wrapper" style="display: inline-block;">
          <input type="radio" id="display-toggle-enable-all" name="manage_display_toggle" value="enable_all">
          <label for="display-toggle-enable-all">${Drupal.t('Enable all fields')}</label>
          <input type="radio" id="display-toggle-disable-all" name="manage_display_toggle" value="disable_all">
          <label for="display-toggle-disable-all">${Drupal.t('Disable all fields')}</label>
        </div>`;

      const $wrapper = $(once("tabledragToggle", ".tabledrag-toggle-weight-wrapper", context));
      const $button = $wrapper.find("button.tabledrag-toggle-weight");
      const $radios = $(Drupal.theme('manageDisplayToggle'));
      // Insert the radio buttons.
      $button?.before($radios);
      // Select the radio buttons.
      const enableAllButton = $('#display-toggle-enable-all');
      const disableAllButton = $('#display-toggle-disable-all');

      // Function to change the region of all fields.
      function toggleFields(region) {
        $('select.field-region', context).each(function () {
          $(this).val(region).trigger('change');
        });
      }

      // Attach change event to the radio buttons.
      enableAllButton.on('change', function () {
        if (this.checked) {
          toggleFields('content');
        }
      });

      disableAllButton.on('change', function () {
        if (this.checked) {
          toggleFields('hidden');
        }
      });
    }
  };

} (jQuery, Drupal, once));
