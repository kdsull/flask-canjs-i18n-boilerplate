define(['can', 'app/models/user/user',
    'utils', 'i18n', 'jquery', 'jquery.bootstrap'],
    function (can, User, utils, i18n, $) {
    'use strict';

    /**
     * Instance of User Contorllers.
     * @private
     */
    var basic;

    /**
     * Control for User Profile
     * @private
     * @author dorajistyle
     * @param {string} target
     * @name users#Basic
     * @constructor
     */
    var Basic = can.Control.extend({
        init: function () {
            utils.logInfo('*User/Basic', 'Initialized');
        },
        load: function (page) {
            basic.show();
            basic.initForm();
            utils.refreshTitle();
        },
        initForm: function () {
            var gender = basic.user_data.gender;
            $('#gender').val(gender);
            switch(gender) {
                case 0:
                    $('.female').addClass('active');
                    break;
                case 1:
                    $('.male').addClass('active');
                    break;
                case 2:
                    $('.unknown').addClass('active');
                    break;
            }
        },
        /**
         * Show Setting view.
         * @memberof users#Basic
         */
        show: function () {
            this.element.html(can.view('/static/views/setting/basic.mustache', {
                user: basic.user_data
            }));
        },
        '.update-user-basic click': function (el, ev) {
            ev.preventDefault();
            ev.stopPropagation();
            this.performUpdateBasic();
            return false;
        },
        '.select-gender click': function (el, ev) {
            $('.select-gender').removeClass('active');
            $(ev.target).addClass('active');
            $('#gender').val(utils.getData(ev, 'value'));
            return false;
        },
        /**
         * Validate a form.
         * @memberof users#Basic
         */
        validateBasic: function () {
            return utils.minLength('first_name', 1, 'validation.firstName')
                && utils.minLength('last_name', 1, 'validation.lastName');
        },
        /**
         * perform Basic action.
         * @memberof users#Basic
         */
        performUpdateBasic: function () {
            if (this.validateBasic()) {
                var form = this.element.find('#updateBasicForm');
                var values = can.deparam(form.serialize());
                var $form = $(form);
                if (!$form.data('submitted')) {
                    $form.data('submitted', true);
                    var update_btn = this.element.find('.update-user-basic');
                    update_btn.attr('disabled', 'disabled');
                    User.findOne({id: values.id}, function (user) {
                        user.attr(values);
                        user.save(function (result) {
                            utils.logJson('performUpdateBasic',result);
                            update_btn.removeAttr('disabled');
                            $form.data('submitted', false);
                            utils.showSuccessMsg(i18n.t('setting.updateBasic.done'));
                        }, function (xhr) {
                            update_btn.removeAttr('disabled');
                            $form.data('submitted', false);
                            utils.handleStatusWithErrorMsg(xhr, i18n.t('setting.updateBasic.fail'));
                        });
                    });
                }
            } else {
                utils.showMessages();
            }
        }
    });


    /**
     * Router for basic.
     * @author dorajistyle
     * @param {string} target
     * @function Router
     * @name setting#Basic_Router
     * @constructor
     */
     var Router = can.Control.extend({
        defaults: {}
        }, {
            init: function () {
                basic = undefined;
                utils.logInfo('*setting/Basic/Router', 'Initialized');
            },
            allocate: function () {
                var $app = utils.getFreshDiv('setting-basic');
                basic = new Basic($app);
            },
            load: function(user) {
                utils.logDebug('*setting/Basic/Router', 'loaded');
                utils.allocate(this, basic);
                basic.user_data = user;
                basic.load();
            }
        });

    return Router;
});