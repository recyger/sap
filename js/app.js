/**
 * Created by vladislav on 10.08.15.
 */
'use strict';
var app = angular.module('Applicants', ['ngRoute', 'ngResource']),
    config = function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/about/', {
                templateUrl: 'about.html',
                controller: 'AboutController'
            })
            .when('/applicants/', {
                templateUrl: 'application.html',
                controller: 'ApplicantsController'
            })
            .when('/applicants/add', {
                templateUrl: 'application.html',
                controller: 'AddApplicantController'
            })
            .when('/applicants/edit/:id', {
                templateUrl: 'application.html',
                controller: 'EditApplicantController'
            })
            .when('/applicants/delete/:id', {
                templateUrl: 'application.html',
                controller: 'DeleteApplicantController'
            })
            .when('/applicants/delete', {
                templateUrl: 'application.html',
                controller: 'DeleteAllApplicantController'
            })
            .when('/settings/', {
                templateUrl: 'application.html',
                controller: 'SettingsController'
            })
            .otherwise({
                redirectTo: '/about/'
            });
        $locationProvider.html5Mode(true);
    },
    main = function ($scope, $http, Settings) {
        $scope.state = false;
        $scope.app = {
            titles: {
                about: 'Об авторе',
                applicants: 'Соискатели',
                settings: 'Настройки'
            },
            tab: 'about',
            author: 'Карпенко Владислав Николаевич',
            phone: '+7 (903) 184-81-22',
            email: 'recyger@gmail.com',
            skype: 'recyger',
            technologies: [{name: 'HTML5'}, {name: 'CSS3'}, {name: 'AngularJS', 'classes': 'blue'}]
        };
        $scope.settings = {
            background: 'grey',
            backgrounds: [
                {label: 'Темный', value: 'dark'},
                {label: 'Серый', value: 'grey'},
                {label: 'Светлый', value: 'light'}
            ],
            patterns: {
                surname: '^(?!\ )([а-яА-ЯёЁ\ IVX\"-\']+?(?:[а-яА-ЯёЁIVX\"-\'])$|[a-zA-Z\ \"-\']+?(?:[a-zA-Z\"-\'])$)'
            },
            length: {
                name: {
                    min: 2,
                    max: 50
                },
                surname: {
                    min: 2,
                    max: 50
                }
            }
        };
        $scope.applicants = [];
        Settings.get().$promise.then(function (data) {
            angular.extend($scope.settings, data);
            //$scope.setState(true);
        });
        $scope.setState = function (value) {
            $scope.ready = value;
        }
    },
    about = function ($scope) {
        $scope.app.tab = 'about';
        $scope.data = [
            {
                name: 'Языки программирование',
                items: [
                    {name: 'Python'},
                    {name: 'PHP'},
                    {name: 'Qt/C++'},
                    {name: 'Delphi 6/7'},
                    {name: 'Bash'},
                    {name: 'JavaScript/jQuery/Mootools/AngularJS'},
                    {name: 'Lua', tooltip: 'Начальный уровень'}
                ]
            },
            {
                name: 'Базы данных',
                items: [
                    {name: 'MySQL'},
                    {name: 'SQLite'},
                    {name: 'Redis'},
                    {name: 'MongoDB', tooltip: 'Начальный уровень'}
                ]
            },
            {
                name: 'Формальные языки',
                items: [
                    {name: 'HTML/HTML5/XML'},
                    {name: 'CSS/CSS3/SASS/LESS'},
                    {name: 'JSON'}
                ]
            },
            {
                name: 'Операционные системы',
                items: [
                    {name: 'MS Windows XP/7/8/10 Server 2003/2008'},
                    {name: 'Linux(ArchLinux/Debian/Ubuntu/Kubuntu)'},
                    {name: 'Unix(FreeBSD/OS X)'}
                ]
            },
            {
                name: 'Прочее',
                items: [
                    {name: 'Программирование Мини-АТС', tooltip: 'LG SOHO, "Протон", "МиниКом"'},
                    {name: 'XMPP', tooltip: 'Информационный бот'},
                    {
                        name: 'RabbitMQ',
                        tooltip: 'Обмен данными между приложениями и обработчиками.'
                    }
                ]
            }
        ];
        //$scope.setState(true);
    },
    applicants = function ($scope, Applicants) {
        $scope.app.tab = 'applicants';
        Applicants.getAll('', function (data) {
            $scope.applicants.splice(0, $scope.applicants.length);
            angular.extend($scope.applicants, data);
        });
    },
    addApplicant = function ($scope, Applicants) {
        $scope.app.tab = 'applicants';
        $scope.error = '';
        $scope.dialog = true;
        $scope.applicant = {};
        $scope.save = function (event) {
            if (!$scope.form.$invalid) {
                Applicants.create($scope.applicant).$promise.then(
                    function () {

                    },
                    function () {
                        event.preventDefault();
                    }
                );
            } else {
                event.preventDefault();
            }

        };
        $scope.getError = function() {
            if ($scope.form.name.$error.minlength || $scope.form.surname.$error.minlength) {
                return 'Слишком мало символов.';
            }
            if ($scope.form.name.$error.maxlength || $scope.form.surname.$error.maxlength) {
                return 'Слишком мало символов.';
            }
            if ($scope.form.surname.$error.pattern) {
                return 'Для поля "Фамилия" разрешены символы пробел и русские или английские.';
            }
            return $scope.error;
        }
    },
    editApplicant = function ($scope, Applicants, $routeParams) {
        //$scope.setState(false);
        $scope.app.tab = 'applicants';
        $scope.error = '';
        $scope.dialog = true;
        $scope.edit = true;
        $scope.applicant = {};
        Applicants.get($routeParams, function (data) {
            $scope.applicant = data;
            //$scope.setState(true);
        });
        $scope.save = function (event) {
            if (!$scope.form.$invalid) {
                Applicants.update($scope.applicant).$promise.then(
                    function () {

                    },
                    function () {
                        event.preventDefault();
                    }
                );
            } else {
                event.preventDefault();
            }

        }
    },
    deleteApplicant = function ($scope, Applicants, $routeParams) {
        //$scope.setState(false);
        $scope.app.tab = 'applicants';
        $scope.alert = true;
        $scope.applicant = {};
        Applicants.get($routeParams, function (data) {
            $scope.applicant = data;
            //$scope.setState(true);
        });
        $scope.delete = function () {
            Applicants.delete($routeParams);
        }
    },
    deleteAllApplicant = function ($scope, Applicants) {
        //$scope.setState(false);
        $scope.app.tab = 'applicants';
        $scope.alert = true;
        $scope.all = true;
        $scope.delete = function () {
            Applicants.deleteAll();
        }
    },
    applicantsResource = function ($resource) {
        return $resource(' http://applicants-tenet.rhcloud.com/api/1/recyger/applicants/:id', {id: '@id'}, {
            'get': {method: 'GET', data: '', headers: {'Content-Type': 'application/json'}},
            'getAll': {method: 'GET', data: '', headers: {'Content-Type': 'application/json'}, isArray: true},
            'create': {
                method: 'POST', data: '', headers: {'Content-Type': 'application/json'},
                transformRequest: function (data) {
                    return angular.toJson(cleanData(data));
                }
            },
            'update': {
                method: 'PUT', data: '', headers: {'Content-Type': 'application/json'},
                transformRequest: function (data) {
                    return angular.toJson(cleanData(data));
                }
            },
            'delete': {method: 'DELETE', data: '', headers: {'Content-Type': 'application/json'}},
            'deleteAll': {method: 'DELETE', data: '', headers: {'Content-Type': 'application/json'}}
        });
    },
    settings = function ($scope, Settings) {
        $scope.app.tab = 'settings';
        //var cmp = function (a, b) {
        //    var result = false;
        //    if (angular.isObject(a) && angular.isObject(b)) {
        //        angular.forEach(b, function (value, index) {
        //            if (angular.isNumber(index) || index.indexOf('$') === -1) {
        //                if (angular.isObject(value)) {
        //                    if (cmp(a[index], value)) {
        //                        result = true;
        //                        return false;
        //                    }
        //                } else if (a[index] !== value) {
        //                    result = true;
        //                    return false;
        //                }
        //            }
        //        });
        //    }
        //    else {
        //        result = true;
        //    }
        //    return result;
        //};
        //$scope.changes = false;
        //$scope.bakup_settings = {};
        //angular.extend($scope.bakup_settings, $scope.settings);
        //$scope.$watch('settings', function (value) {
        //    $scope.changes = cmp($scope.settings, $scope.bakup_settings);
        //}, true);
        //$scope.reset = function () {
        //    angular.extend($scope.settings, $scope.bakup_settings);
        //};
        $scope.save = function () {
            Settings.update($scope.settings);
        };
    },
    settingsResource = function ($resource) {
        return $resource(' http://applicants-tenet.rhcloud.com/api/1/recyger/settings', {}, {
            'get': {method: 'GET', data: '', headers: {'Content-Type': 'application/json'}},
            'update': {
                method: 'PUT', data: '', headers: {'Content-Type': 'application/json'},
                transformRequest: function (data) {
                    return angular.toJson(cleanData(data));
                }
            },
            'delete': {method: 'DELETE', data: '', headers: {'Content-Type': 'application/json'}}
        });
    },
    cleanData = function (data) {
        var result = {};
        angular.forEach(data, function (value, index) {
            if (index.indexOf('$') == -1) {
                if (angular.isObject(value)) {
                    result[index] = cleanData(value);
                } else {
                    result[index] = value
                }
            }
        });
        return result;
    },
    tooltip = function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                var tooltip = $parse(attributes['ngTooltip'])(scope);
                if (tooltip) {
                    tooltip = angular.element('<div class="tooltip">' + tooltip + '</div>');
                    element
                        .addClass('has-tooltip')
                        .append(' <i class="fa fa-question-circle"></i>')
                        .after(tooltip)
                        .on('mouseenter', function () {
                            var rect = element[0].getBoundingClientRect();
                            console.log(rect);
                            tooltip.css({
                                'left': (
                                    rect.left +
                                    (element[0].offsetWidth / 2) -
                                    (tooltip[0].offsetWidth / 2)
                                ) + 'px',
                                'top': (rect.top - tooltip[0].offsetHeight) + 'px'
                            })
                                .addClass('in');
                        }).on('mouseleave', function () {
                            tooltip.removeClass('in');
                        });
                }
            }
        }
    },
    code = function () {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                var sum = 0,
                    abc = [];
                if (!scope.item || !scope.item.name || !scope.item.surname) {
                    return;
                }
                angular.forEach(scope.item.name, function (value) {
                    var charCode = value.toLocaleLowerCase().charCodeAt();
                    if (abc.indexOf(charCode) === -1) {
                        abc.push(charCode);
                    }
                });
                angular.forEach(scope.item.surname, function (value) {
                    var charCode = value.toLocaleLowerCase().charCodeAt();
                    if (abc.indexOf(charCode) === -1) {
                        abc.push(charCode);
                    }
                    sum += charCode;
                });
                abc = abc.sort(function (a, b) {
                    return a - b;
                });
                abc = abc.map(function (code) {
                    return String.fromCharCode(code);
                });
                abc = abc.join('');
                element.text(sum + abc);
            }
        }
    };
app.config(['$routeProvider', '$locationProvider', config]);
app.directive('ngTooltip', ['$parse', tooltip]);
app.directive('appCode', [code]);
app.factory('Settings', ['$resource', settingsResource]);
app.factory('Applicants', ['$resource', applicantsResource]);
app.controller('MainController', ['$scope', '$http', 'Settings', main]);
app.controller('AboutController', ['$scope', about]);
app.controller('ApplicantsController', ['$scope', 'Applicants', applicants]);
app.controller('AddApplicantController', ['$scope', 'Applicants', addApplicant]);
app.controller('EditApplicantController', ['$scope', 'Applicants', '$routeParams', editApplicant]);
app.controller('DeleteApplicantController', ['$scope', 'Applicants', '$routeParams', deleteApplicant]);
app.controller('DeleteAllApplicantController', ['$scope', 'Applicants', deleteAllApplicant]);
app.controller('SettingsController', ['$scope', 'Settings', settings]);