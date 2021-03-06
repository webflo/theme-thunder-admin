(function ($, Drupal) {

  'use strict';

  /**
   * Adds a sorting button to the top of the table and adds checkboxes to the rows.
   *
   * On click on the sorting button, show/hide the checkboxes and add/remove sorting targets.
   */
  Drupal.tableDrag.prototype.initCkbx = function () {
    // build toggle button
    this.toggleCheckboxButtonWrapper = $('<button type="button" class="tabledrag-toggle-checkbox button"></button>')
      .on('click', $.proxy(function (e) {
        e.preventDefault();
        if (!this.$table.hasClass('tabledrag-checkbox-active')) {
          this.triggerStartEvent();
        }
        this.$table.toggleClass('tabledrag-checkbox-active');
        this.toggleCheckboxes();
        this.toggleSortTargets();
        this.toggleStyleOfCheckboxButton();
        if (!this.$table.hasClass('tabledrag-checkbox-active')) {
          this.triggerEndEvent();
        }
      }, this))
      .text(Drupal.t('Sort'))
      .wrap('<tr class="tabledrag-toggle-checkbox-wrapper"><th colspan="3"></th></tr>')
      .parent().parent();

    // add sorting toggle button on top
    this.$table.find('thead').append(this.toggleCheckboxButtonWrapper);

    // add sorting checkbox to items
    this.$table.find('.tabledrag-handle').after(
      $('<input type="checkbox" class="tabledrag-checkbox" />')
        .hide()
    );
  };

  Drupal.tableDrag.prototype.toggleStyleOfCheckboxButton = function () {
    var button = this.toggleCheckboxButtonWrapper.find('button');
    button.toggleClass('button--primary');

    var text = Drupal.t('Sort');
    if (this.$table.hasClass('tabledrag-checkbox-active')) {
      text = Drupal.t('Finish sort');
    }
    button.text(text);
  };

  /**
   * Adds/Removes sort targets.
   */
  Drupal.tableDrag.prototype.toggleSortTargets = function () {
    if (this.$table.hasClass('tabledrag-checkbox-active')) {
      this.addSortTargets();
    }
    else {
      this.removeSortTargets();
    }
  };

  /**
   * Triggers a start event.
   */
  Drupal.tableDrag.prototype.triggerStartEvent = function () {
    this.$table.trigger('tabledrag-checkbox-start');
  };

  /**
   * Triggers an end event.
   */
  Drupal.tableDrag.prototype.triggerEndEvent = function () {
    this.$table.trigger('tabledrag-checkbox-end');
  };

  /**
   * Adds sorting targets to the table, which handle the sorting on click.
   */
  Drupal.tableDrag.prototype.addSortTargets = function () {
    var $target = $(
      '<a href="#" class="tabledrag-sort-target">' +
        '<span class="tabledrag-sort-target-left"></span>' +
        '<span class="tabledrag-sort-target-middle"></span>' +
        '<span class="tabledrag-sort-target-right"></span>' +
      '</a>'
    )
      .on('click', $.proxy(function (e) {
        e.preventDefault();

        var $targetWrapper = $(e.target).closest('tr');
        var row = $targetWrapper.prev();
        var swapAfter = true;

        // on click on the first target, the rows should be inserted before the first row.
        if ($targetWrapper.hasClass('tabledrag-sort-before')) {
          row = $targetWrapper.next();
          swapAfter = false;
        }

        this.removeSortTargets();
        this.sort(row, swapAfter);
        this.addSortTargets();

      }, this))
      .wrap('<tr class="tabledrag-sort-target-wrapper"><td class="tabledrag-sort-target-column" colspan="3"></td></tr>')
      .parent().parent();

    this.$table.find('.draggable').after($target);
    this.$table.find('.draggable:first').before($target.clone(true).addClass('tabledrag-sort-before'));

  };

  /**
   * Removes all sorting targets from the table.
   */
  Drupal.tableDrag.prototype.removeSortTargets = function () {
    this.$table.find('.tabledrag-sort-target-wrapper').remove();
  };

  /**
   * Switches the visibility between the tabledrag checkbox and handle.
   */
  Drupal.tableDrag.prototype.toggleCheckboxes = function () {
    // The tabledrag handle is toggled via CSS
    this.$table.find('.tabledrag-checkbox').toggle();
  };

  /**
   * Sorts all selected rows before/after a specified row.
   *
   * @param {Object} row - row before/after which selected rows should be inserted.
   * @param {boolean} swapAfter - if the rows should be inserted after specified row
   */
  Drupal.tableDrag.prototype.sort = function (row, swapAfter) {
    swapAfter = swapAfter || false;

    var checkboxes = this.$table.find('input.tabledrag-checkbox:checked');
    var rowsToBeMoved = checkboxes.closest('tr.draggable');

    // Iterate over selected rows and swap each separately.
    rowsToBeMoved.each($.proxy(function (index, element) {
      var currentRow = new this.row(rowsToBeMoved[index], 'pointer', self.indentEnabled, self.maxDepth, true);
      this.rowObject = currentRow;

      if (swapAfter) {
        currentRow.swap('after', row);
        // Since we want to keep the order and inserting after a row,
        // we have to move the next row to after this one.
        row = $(rowsToBeMoved[index]);
      }
      else {
        currentRow.swap('before', row);
        row = $(rowsToBeMoved[index]);
        swapAfter = true;
      }

      currentRow.markChanged();

      // also updates the weights.
      this.updateFields(currentRow.element);
    }, this));

    this.restripeTable();

    checkboxes.attr('checked', false);

    this.onDrop();

  };


  Drupal.behaviors.tableDragCheckbox = {
    attach: function (context, settings) {
      for (var base in settings.tableDrag) {
        if (settings.tableDrag.hasOwnProperty(base)) {
          var $table = $(context).find('#' + base).once('tabledrag-checkbox');
          if ($table.length) {
            Drupal.tableDrag[base].initCkbx();
          }
        }
      }
    }
  };

})(jQuery, Drupal);
