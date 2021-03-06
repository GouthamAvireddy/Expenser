

var fb = new Firebase("https://expenserroom.firebaseio.com/");
angular.module('ionicApp', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives', 'firebase', 'pascalprecht.translate'])
        
        .run(function ($ionicPlatform, $rootScope, $firebaseAuth, $ionicScrollDelegate, $state, Auth, fireBaseData, UserData) {
            
            $ionicPlatform.ready(function () {

                
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                
                
                $rootScope.settings = {
                    'languages' : [{
                            'prefix':'en',
                            'name':'English'
                        },{
                            'prefix':'fr',
                            'name':'Francais'
                    }] 
                };
                
                $rootScope.isAdmin = false;
                $rootScope.authData = {};
                
                Auth.$onAuth(function (authData) {
                    if (authData) {
                        console.log("Logged in as:", authData);
                        
                        $rootScope.authData = authData;
                        UserData.checkRoomMateHasHouse(authData.password.email).then(function(hasHouse) {
                            if(hasHouse){
                                $state.go("tabs.dashboard");
                            }else{
                                console.log('No House!!!');
                                $rootScope.hide();
                                $state.go("housechoice");
                            }
                        }, function(error){
                            console.log('No House!!!');
                            $rootScope.hide();
                            $state.go("housechoice");
                        });   
                    } else {
                        $rootScope.hide();
                        $state.go("introduction");
                    }
                });
                
                $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
                    if (error === "AUTH_REQUIRED") {
                        $state.go("signin");
                    }
                });
                
            });
        })
        
        .config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider, $translateProvider) {
            
            $ionicConfigProvider.views.maxCache(0);
            $ionicConfigProvider.tabs.position('top');
            $ionicConfigProvider.tabs.style('striped');
            $ionicConfigProvider.navBar.alignTitle('left');
            
            
            $translateProvider.translations('en', {
                SIGNIN: "Sign-In",
                REGISTER: "Register",
                LOGOUT: "Logout",
                REGISTER_DONTHAVEACCOUNT: "I dont have an account",
                REGISTER_ALREADYHAVEACCOUNT: "I already have an account",
                FORM_EMAIL: "Email",
                FORM_PASSWORD: "Password",
                FORM_FIRSTNAME: "First Name",
                FORM_SURNAME: "Surname",
                TABS_NAME_DASHBOARD: "Dashboard",
                TABS_NAME_EXPENSES: "Expenses",
                TABS_NAME_MEMBERS: "Members",
                TABS_NAME_SETTINGS: "Settings",
                SETTINGS_LANGUAGE: "Change language",
                SETTINGS_EDIT_PROFILE: "Edit Profile",
                SETTINGS_QUIT_HOUSE: "Quit House"
            });
            $translateProvider.translations('fr', {
                SIGNIN: "Se connecter",
                REGISTER: "Creer un compte",
                LOGOUT: "Se deconnecter",
                REGISTER_ALREADYHAVEACCOUNT: "J'ai deja un compte",
                FORM_EMAIL: "Email",
                FORM_PASSWORD: "Mot de passe",
                FORM_FIRSTNAME: "Nom",
                FORM_SURNAME: "Prenom",
                TABS_NAME_DASHBOARD: "Dashboard",
                TABS_NAME_EXPENSES: "Depenses",
                TABS_NAME_MEMBERS: "Membres",
                TABS_NAME_SETTINGS: "Configuration",
                SETTINGS_LANGUAGE: "Changer de langue",
                SETTINGS_EDIT_PROFILE: "Modifier mon profil",
                SETTINGS_QUIT_HOUSE: "Quitter cette maison"
                
            });
            $translateProvider.preferredLanguage("en");
            $translateProvider.fallbackLanguage("en");
            
    
            $stateProvider
   
                    .state('introduction', {
                        url: '/introduction',
                        templateUrl: 'templates/introduction.html',
                        controller: 'IntroductionCtrl'
                    })

                    .state('signin', {
                        url: '/sign-in',
                        templateUrl: 'templates/sign-in.html',
                        controller: 'SignInCtrl',
                        resolve: {
                            "currentAuth": ["Auth",
                                function (Auth) {
                                    return Auth.$waitForAuth();
                                }]
                        }
                    })
                    
                    .state('register', {
                        url: '/register',
                        templateUrl: 'templates/register.html',
                        controller: 'RegisterCtrl'
                    })
                    
                    .state('housechoice', {
                        url: '/housechoice',
                        templateUrl: 'templates/intro/house-choice.html',
                        controller: 'HouseChoiceCtrl'
                    })
                    
                    .state('registerhouse', {
                        url: '/registerhouse',
                        templateUrl: 'templates/intro/register-house.html',
                        controller: 'RegisterHouseCtrl'
                    })
                    .state('joinhouse', {
                        url: '/joinhouse',
                        templateUrl: 'templates/intro/join-house.html',
                        controller: 'JoinHouseCtrl'
                    })

                
                    .state('tabs', {
                        url: '/tab',
                        abstract: true,
                        templateUrl: 'templates/tabs/tabs.html',
                        resolve: {
                            "currentAuth": ["Auth",
                                function (Auth) {
                                    return Auth.$requireAuth();
                                }]
                        }
                    })

                    .state('tabs.dashboard', {
                        url: '/dashboard',
                        cache: false,
                        views: {
                            'tab-dashboard': {
                                templateUrl: 'templates/tabs/dashboard.html',
                                controller: 'DashboardCtrl'
                            }
                        }
                    })
                                
                    .state('tabs.settings', {
                        url: '/settings',
                        views: {
                            'tab-settings': {
                                templateUrl: 'templates/tabs/settings.html',
                                controller: 'SettingsCtrl'
                            }
                        }
                    })
                    
                    /* EXPENSES */
                    .state('tabs.expenses', {
                        url: '/expenses',
                        views: {
                            'tab-expenses': {
                                templateUrl: 'templates/tabs/expenses.html',
                                controller: 'ExpensesCtrl'
                            }
                        }
                    })
                    .state('tabs.expense-detail', {
                        url: '/expense/:expenseId',
                        views: {
                            'tab-expenses': {
                                templateUrl: 'templates/tabs/expense-detail.html',
                                controller: 'ExpenseDetailCtrl',
                                resolve: {
                                    expense: function($stateParams, ExpensesData) {
                                        var id = $stateParams.expenseId;
                                        return ExpensesData.getExpense(id);
                                    }
                                }
                            }
                        }
                    })
                    
                    
                    .state('tabs.members', {
                        url: '/members',
                        views: {
                            'tab-members': {
                                templateUrl: 'templates/tabs/members.html',
                                controller: 'MembersCtrl'
                            }
                        }
                    })
                    .state('tabs.member-detail', {
                        url: '/member/:memberId',
                        views: {
                            'tab-members': {
                                templateUrl: 'templates/tabs/member-detail.html',
                                controller: 'MembersDetailCtrl',
                                resolve: {
                                    member: function($stateParams, UserData) {
                                        var email = $stateParams.memberId;
                                        return UserData.getRoomMate(email);
                                    }
                                }
                            }
                        }
                    });

             $urlRouterProvider.otherwise('/introduction');
        })
