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
        this.timeout(20000);
        var promise = machinist.blueprint("user").make({
            name: "Warner Onstine",
            username: "warner",
            emails: ["warner@test.com"]
        });

        promise.then(
            function(docs) {
                // console.log("saved doc %j", docs);
                should.exist(docs);
                docs[0].name.should.equal("Warner Onstine");

                //check default value of blueprint
                docs[0].active.should.equal(true);
                done();
            },
            function(err){
                should.not.exist(err);
                done();
            }
        );
        
        
    });
});
