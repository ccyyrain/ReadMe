var express = require('express');
var router = express.Router();

const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');

router.post('/login', function(req, res, next) {
  const userId = req.body.sub;
  const userName = req.body.name;
  req.db.collection('readMe').findOne({"userId" : userId}, function(err, result){
    if(result){
    res.json({
      data: result
    });}
    else{
      var bookList = {
        toRead: [],
        inProgress: [],
        finished: []
      };
      var newData = {
        userId: userId,
        userName: userName,
        book: bookList
      }
      req.db.collection('readMe').insertOne(newData);
      res.json({
        data: newData
      });
    }
  });
});

router.post('/addBook', function(req, res, next) {
  const userId = req.body.user;
  const bookInfo = req.body.book;
  const bookToGo = req.body.toGo;
  req.db.collection('readMe').findOne({"userId" : userId}, function(err, result){
    var addNew = result.book;
    if(bookToGo == "toRead"){
      addNew.toRead.push(bookInfo);
    }
    else if(bookToGo == "inProgress"){
      addNew.inProgress.push(bookInfo);
    }
    else{
      addNew.finished.push(bookInfo);
    }
    let myPromise = new Promise((resolve,reject) =>{
      req.db.collection('readMe').updateOne({"userId" : userId}, {$set: {
        "book" : addNew
      }});
      resolve("success");
  });
  myPromise.then(r=>{res.json({})})
});
});
/***********This serves add a new note************/
router.post('/addNote', function(req, res, next) {
  const userId = req.body.user;
  const note = req.body.note;
  const bookId = req.body.bookId;
  const category = req.body.category;
  req.db.collection('readMe').findOne({"userId" : userId}, function(err, result){
    // console.log(result, "check the db whether it has user's event");
    var addNew = result.book;
    var index = 0;
    if(category == "toRead"){
      for(var i = 0; i < addNew.toRead.length; ++i){
        if(req.body.bookId == addNew.toRead[i].bookId){
          index = i;
          addNew.toRead[i].notes.push(note);
          req.db.collection('readMe').updateOne({"userId" : userId}, {$set: {
            ["book.toRead."+[index]+".notes"]: addNew.toRead[i].notes
          }}).then(res.json({}));
          break;
        }
      }
    }
    else if(category == "reading"){
      for(var i = 0; i < addNew.inProgress.length; ++i){
        if(req.body.bookId == addNew.inProgress[i].bookId){
          index = i;
          addNew.inProgress[i].notes.push(note);
           var set = {};
          req.db.collection('readMe').updateOne({"userId" : userId}, {$set: {
            ["book.inProgress."+i+".notes"]: addNew.inProgress[i].notes
          }}).then(res.json({}));
        }
      }
    }
    else{
      for(var i = 0; i < addNew.finished.length; ++i){
        if(req.body.bookId == addNew.finished[i].bookId){
          index = i;
          addNew.finished[i].notes.push(note);
          req.db.collection('readMe').updateOne({"userId" : userId}, {$set: {
            ["book.finished."+[index]+".notes"]: addNew.finished[i].notes
          }}).then(r=>{res.json({})});
          break;
        }
      }
    }
  });
});

router.post('/updateNote',function(req, res, next){
  console.log("updateNoteing")
  const userId = req.body.user;
  const noteId = req.body.noteId;
  const bookId = req.body.bookId;
  const category = req.body.category;
  const text = req.body.text;
  req.db.collection('readMe').findOne({"userId" : userId}, function(err, result){
    var addNew = result.book;
    var index = 0;
     if(category == "reading"){
      for(var i = 0; i < addNew.inProgress.length; ++i){
        if(bookId == addNew.inProgress[i].bookId){
          index = i;
          var updateTarget = addNew.inProgress[i].notes;
          for(var j = 0; j < updateTarget.length; j++){
            if(noteId == updateTarget[j].noteId){
              addNew.inProgress[i].notes[j].text = text;
              break;
            }
          }
        }
      }
      req.db.collection('readMe').updateOne({"userId" : userId}, {$set: {
        ["book.inProgress."+index+".notes"]: addNew.inProgress[index].notes
      }});
    }
    else{
      console.log("noteId",noteId,"bookId",bookId,"text",text,"category",category,"trying to update note")
      for(var i = 0; i < addNew.finished.length; ++i){
        if(bookId == addNew.finished[i].bookId){
          index = i;
          var updateTarget = addNew.finished[i].notes;
          for(var j = 0; j < updateTarget.length; j++){
            if(noteId == updateTarget[j].noteId){
              addNew.finished[i].notes[j].text = text;
              break;
            }
          }
        }
      }
      req.db.collection('readMe').updateOne({"userId" : userId}, {$set: {
        ["book.finished."+[index]+".notes"]: addNew.finished[index].notes
      }});
    }
      res.json({
      });
})
})

router.post('/deleteNote', function(req, res, next) {
  const userId = req.body.user;
  const noteId = req.body.noteId;
  const bookId = req.body.bookId;
  const category = req.body.category;
  req.db.collection('readMe').findOne({"userId" : userId}, function(err, result){
    var addNew = result.book;
    var index = 0;
    if(category == "toRead"){
      for(var i = 0; i < addNew.toRead.length; ++i){
        if(bookId == addNew.toRead[i].bookId){
          index = i;
          var deleteTarget = addNew.toRead[i].notes;
          for(var j = 0; j < deleteTarget.length; j++){
            if(noteId == deleteTarget[j].noteId){
              addNew.toRead[i].notes.splice(j, 1);
              break;
            }
          }
        }
      }
      req.db.collection('readMe').updateOne({"userId" : userId}, {$set: {
        ["book.toRead." + index + ".notes"]: addNew.toRead[index].notes
      }}).then(res.json({}));
    }
    else if(category == "reading"){
      for(var i = 0; i < addNew.inProgress.length; ++i){
        if(bookId == addNew.inProgress[i].bookId){
          index = i;
          var deleteTarget = addNew.inProgress[i].notes;
          for(var j = 0; j < deleteTarget.length; j++){
            if(noteId == deleteTarget[j].noteId){
              addNew.inProgress[i].notes.splice(j, 1);
              break;
            }
          }
        }
      }
      req.db.collection('readMe').updateOne({"userId" : userId}, {$set: {
        ["book.inProgress."+index+".notes"]: addNew.inProgress[index].notes
      }}).then(res.json({}));
    }
    else{
      for(var i = 0; i < addNew.finished.length; ++i){
        if(bookId == addNew.finished[i].bookId){
          index = i;
          var deleteTarget = addNew.finished[i].notes;
          for(var j = 0; j < deleteTarget.length; j++){
            if(noteId == deleteTarget[j].noteId){
              addNew.finished[i].notes.splice(j, 1);
              break;
            }
          }
        }
      }
      req.db.collection('readMe').updateOne({"userId" : userId}, {$set: {
        ["book.finished."+[index]+".notes"]: addNew.finished[index].notes
      }}).then(res.json({}));
    }
  });
});


router.post('/getData', function(req, res, next) {
  const userId = req.body.sub;
  req.db.collection('readMe').findOne({"userId" : userId}, function(err, result){
    if(result){
      var booklistToShow = result.book;
      res.json({
        bookList: booklistToShow
      });
    }
    else{
      res.json({

      })
    }
  });
});

router.post('/changeStatus', function(req, res, next) {
  console.log('auth0 user id:', req.body.profile.sub);
  const userId = req.body.profile.sub;
  const bookId = req.body.bookId;
  req.db.collection('readMe').findOne({"userId" : userId}, function(err, result){
    var toReadList = result.book.toRead;
    var readingList = result.book.inProgress;
    var doneList = result.book.finished;
    var index;
    var addReading = false, addDone = false;
    for(var i = 0; i < toReadList.length; i++){
      if(toReadList[i].bookId === bookId){
        index = i;
        addReading = true;
        break;
      }
    }
    for(var j = 0; j < readingList.length; j++){
      if(readingList[j].bookId === bookId){
        index = j;
        addDone = true;
        break;
      }
    }
    if(addReading){
      readingList.push(toReadList[index]);
      toReadList.splice(index, 1);
    }
    else if(addDone){
      doneList.push(readingList[index]);
      readingList.splice(index, 1);
    }
    req.db.collection('readMe').updateOne({"userId" : userId}, {$set: {
      "book.toRead" : toReadList,
      "book.inProgress": readingList,
      "book.finished": doneList
    }}).then(res.json({
          }));

  });
});


module.exports = router;
