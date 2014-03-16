var
    should = require("should"),
    machinist = require("machinist-js"),
    opts = {database: 'machinist-test'},
    store = require("../lib/mongo_store")(opts);

describe("Machinist API", function(){
    var userBlueprint;

    before(function(done){
        machinist.addStore(store);
        userBlueprint = machinist.blueprint("user", "users", {
            active: true
        });
        return done();
    });

    it("should create a new MongoDB store", function(done){
        var mongo = require("../lib/mongo_store")({database: 'machinist-test'});
        should.exist(mongo);

        done();

    });


    it("it should create a new user using blueprint", function(done){
        this.timeout(10000);
        machinist.blueprint("user").make({
            name: "Warner Onstine",
            username: "warner",
            emails: ["warner@test.com"]
        }, function(err, doc){
            should.not.exist(err);
            should.exist(doc);

        });
        
        
    });
});
