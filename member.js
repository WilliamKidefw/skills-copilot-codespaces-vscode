function skillsMember() {
    return {
        restrict: 'E',
        scope: {
            member: '=',
            skills: '='
        },
        templateUrl: 'templates/skills-member.html'
    };
}