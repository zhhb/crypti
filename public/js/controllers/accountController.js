webApp.controller('accountController', ['$scope', '$rootScope', '$http', "userService", "$interval", "sendCryptiModal", function($rootScope, $scope, $http, userService, $interval, sendCryptiModal) {
    $scope.address = userService.address;
    $scope.balance = userService.balance;
    $scope.unconfirmedBalance = userService.unconfirmedBalance;
    $scope.effectiveBalance = userService.effectiveBalance ;

    $scope.getTransactions = function () {
        $http.get("/api/getAllTransactions", { params : { accountId : userService.address }})
            .then(function (resp) {
                $scope.transactions = resp.data.transactions;
            });
    }

    $scope.getBalance = function () {
        $http.get("/api/getBalance", { params : { address : userService.address }})
            .then(function (resp) {
                userService.balance = resp.data.balance;
                userService.unconfirmedBalance = resp.data.unconfirmedBalance;
                userService.effectiveBalance = resp.data.effectiveBalance;
                $scope.balance = userService.balance;
                $scope.unconfirmedBalance = userService.unconfirmedBalance;
                $scope.effectiveBalance = userService.effectiveBalance;
            });
    }

    $scope.balanceInterval = $interval(function () {
        $scope.getBalance();
    }, 1000 * 60);

    $scope.transactionsInterval = $interval(function () {
        $scope.getTransactions();
    }, 1000 * 60);

    $scope.$on('$destroy', function() {
        $interval.cancel($scope.balanceInterval);
        $scope.balanceInterval = null;

        $interval.cancel($scope.transactionsInterval);
        $scope.transactionsInterval = null;
    });

    $scope.sendCrypti = function () {
        $scope.sendCryptiModal = sendCryptiModal.activate({
            totalBalance : $scope.balance,
            destroy: function () {
                $scope.getBalance();
            }
        });
    }

    $scope.getBalance();
    $scope.getTransactions();
}]);