app.controller('compititionCtrl', function($scope, $http, $interval) {
	$scope.timer = 0;

    $scope.compititionList = function () {
    	var id;
    	$http.get('http://api.football-data.org/v1/competitions/?season=2015').then(function(response) {
			$scope.compititionData = response.data;
			$scope.leaguesList = _.pluck($scope.compititionData, 'league');
			$scope.leagues = {
				value: $scope.leaguesList[0],
				values: $scope.leaguesList
			}
			$scope.displayLeagueTable($scope.leagues.value);
		});
		
    }

    $scope.displayLeagueTable = function (league) {
    	var leagueObj = _.find($scope.compititionData, function(obj){return obj.league === league});
    	$http.get('http://api.football-data.org/v1/competitions/'+leagueObj.id+'/leagueTable').then(function(response) {
				$scope.leagueTable = response.data;
				console.log($scope.leagueTable);
		}, function (error){
			console.log(error);
			$scope.leagueTable = null;
		});
    }

    $scope.teamDetail = function (teamName) {

    	var teamData = _.find($scope.leagueTable.standing, function(obj) {
    		return obj.teamName === teamName;
    	});
    	var link = teamData._links.team.href;
    	var indexNumber = link.lastIndexOf('/');
		var teamId = link.substring(indexNumber + 1);

		$http.get('http://api.football-data.org/v1/teams/'+teamId+'/fixtures').then(function(response) {
			$scope.upcomingFixture = response.data;
			$scope.upcomingFixture = _.first($scope.upcomingFixture.fixtures, 5);
			var firstFixture = _.first($scope.upcomingFixture, 1);
			$scope.countDownTimer(firstFixture[0].date);
     		_.each($scope.upcomingFixture, function(obj){
     			var date = 	obj.date;
    			var indexNumber = date.lastIndexOf('T');
    			obj.date = date.substring(0, indexNumber);
    		});
		}, function(error) {
			$scope.upcomingFixture = null;
		});

		$http.get('http://api.football-data.org/v1/teams/'+teamId+'/players').then(function(response) {
			$scope.playerDetail = response.data;
		}, function (error){
			$scope.playerDetail = null;
		});		
    }

    $scope.countDownTimer = function (date) {
    	var countDownDate = new Date(date).getTime();
    	var x = $interval(function() {
		    var now = new Date().getTime();
		    var distance = countDownDate - now;
		    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		    
		    $scope.timer= days + "d " + hours + "h "
		    + minutes + "m " + seconds + "s ";
		    
		    if (distance < 0) {
		        clearInterval(x);
		       $scope.timer = "EXPIRED";
		    }
		}, 1000);
    }
   
});