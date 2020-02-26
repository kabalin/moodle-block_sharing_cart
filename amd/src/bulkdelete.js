define(['jquery', 'core/modal_factory', 'core/modal_events'], function($, ModalFactory, ModalEvents) {

    return {
        init: function() {

            /**
             *  Returns a localized string
             *
             *  @param {String} identifier
             *  @return {String}
             */
            function str(identifier) {
                return M.str.block_sharing_cart[identifier] || M.str.moodle[identifier];
            }

            /**
             *
             * @param obj
             */
            function confirm_modal (obj){
                var trigger = $('#create-modal');
                ModalFactory.create({
                    type: ModalFactory.types.SAVE_CANCEL,
                    title: obj.title,
                    body: obj.body,
                }, trigger).done(function(modal) {
                    modal.setSaveButtonText(obj.save_button);

                    // Figure out what is returned on cancel and continue buttons.
                    // How to change text on buttons
                    modal.getRoot().on(ModalEvents.save, function() {
                        obj.next();
                    });
                    modal.show();
                });
            }

            /**
             *
             * @returns {any[]}
             */
            function get_checks() {
                var els = document.forms["form"].elements;
                var ret = new Array();
                for (var i = 0; i < els.length; i++) {
                    var el = els[i];
                    if (el.type == "checkbox" && el.name.match(/^delete\b/)) {
                        ret.push(el);
                    }
                }
                return ret;
            }

            /**
             *
             * @param check
             */
            function check_all(check) {
                var checks = get_checks();
                for (var i = 0; i < checks.length; i++) {
                    checks[i].checked = check.checked;
                }
                document.forms["form"].elements["delete_checked"].disabled = !check.checked;
            }

            /**
             *
             */
            function check() {
                var delete_checked = document.forms["form"].elements["delete_checked"];
                var checks = get_checks();
                for (var i = 0; i < checks.length; i++) {
                    if (checks[i].checked) {
                        delete_checked.disabled = false;
                        return;
                    }
                }
                delete_checked.disabled = true;
            }

            /**
             * Check activity button
             */
            $('.bulk-delete-item [id^=delete]').on('click', function(){
                check();
            });

            /**
             * Select all checkbox.
             */
            $('.bulk-delete-select-all input').on('click', function() {
                check_all(this);
            });

            /**
             * Delete selected, opens modal for confirmation.
             */
            $('.form_submit').on('click', function(){
                var modal_body = '<ul>';
                var selected_input = $('.bulk-delete-item input:checked');
                $(selected_input).each(function(){
                    var label = $('label[for="'+this.id+'"]');
                    modal_body += '<li>' + label.text() + '</li>';
                });
                modal_body += '</ul>';

                confirm_modal({
                    'title': str('modal_bulkdelete_title'),
                    'body': modal_body,
                    'save_button': str('modal_bulkdelete_confirm'),
                    'next': function() {
                        $('#form').submit();
                    }
                });
            });
        }
    };
});