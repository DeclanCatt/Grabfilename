var resources = window.performance.getEntriesByType("resource");
resources.forEach(function (resource) {
    console.log(resource.name);
});