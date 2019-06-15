(function(){
	const config = {
	    apiKey: "AIzaSyB-qz1QSqXkGBfaUgtQgI_Ro07RSfyukUA",
	    authDomain: "news-9ed5b.firebaseapp.com",
	    databaseURL: "https://news-9ed5b.firebaseio.com",
	    storageBucket: "news-9ed5b.appspot.com",
	  };
	  firebase.initializeApp(config);
	  email = $("#email").val();
	  password = $("#password").val()

	  function get_fields(){
	  	email = $("#email").val();
	  	password = $("#password").val()
	  }

	  //get meals from database
	  getMeals(firebase);
	  
	  $("#login_btn").click(function(){
	  	get_fields()
	  	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log(errorCode, errorMessage);
		});
	  });

	  $("#logout_btn").click(function(){
	  	firebase.auth().signOut();
	  	console.log(email, password);
	  });

	  $("#saveMeal").click(function(){
	  	saveMeal(firebase);
	  	$("#name").val("");
		$("#price").val("");
		$("#discount").val("");
	  });

	  firebase.auth().onAuthStateChanged(firebaseUser => {
	  	if(firebaseUser){
	  		console.log(firebaseUser.email, firebaseUser.displayName);
	  		$("#logout_btn").show();
	  		$(".login_page").addClass("hidden");

	  		$("#order_page").removeClass("hidden");
	  		$("#meal_page").removeClass("hidden");
	  	}else{
	  		console.log("not logged in");
	  		$("#logout_btn").addClass("hidden");
	  		
	  		$("#login_page").removeClass("hidden");

	  		$("#order_page").addClass("hidden");
	  		$("#meal_page").addClass("hidden");
	  	}
	  });



}());
function saveMeal(firebase){
	  var storage = firebase.storage();
	  //name, price, discount, img_meal

	  var file = document.getElementById("fileinput").files[0];
	  //var file = $('#fileinput').prop('files');
	  name = $("#name").val();
	  price = $("#price").val();
	  discount = $("#discount").val();
	    console.log(file);
	  
	  var storageRef = firebase.storage().ref();
	  
	  //dynamically set reference to the file name
	  var thisRef = storageRef.child(file.name);

	  //put request upload file to firebase storage
	  console.log(thisRef.put(file));
	  //thisRef.put(file).then(function(snapshot) {
	  //  console.log('Uploaded a blob or file!');
	//});
	  
	  //get request to get URL for uploaded file
	  thisRef.getDownloadURL().then(function(url) {
	  console.log(url);
	  //fb.database().ref().child('user-data').push().key;
	  firebase.database().ref().child('meals').push({'name':name,'price':price,'discount':discount,'url':url});
	  })

	  }


	  function getMeals(firebase){
	  	return firebase.database().ref('/meals/').once('value').then(function(snapshot) {
			  console.log(snapshot.val());
			  //setDisplay(snapshot);
			  snapshot.forEach(function(childNodes){
		  		$("#meal_page table").append("<tr><td>"+childNodes.val().name+"</td><td>"+childNodes.val().price+"</td><td>"+childNodes.val().discount+"</td><td><a href='"+childNodes.val().url+"'>img url</a></td><td>"+"</td><td><button>edit</button><button>delete</button></td></tr>");
		  	});
		  });
	  }


//rim of  