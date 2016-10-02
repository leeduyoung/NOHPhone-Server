var express = require('express');
var router = express.Router();
var fs = require('fs');

var pgp = require('pg-promise')();
var dbConfig = require('../db-config.js');
var db = pgp(dbConfig.connection);

var memberService = require('./services/memberService.js'); //member서비스
var commonService = require('./services/commonService.js'); //common서비스

var profileImagePath = '/var/www/image/nophone/profiles/';

/**
 * 1. 로그인
 */
router.post('/signin', function (req, res, next) {

  // 1. 로그인 성공시 session 정보에 user id를 넣음.
  // 2. 홈화면에서 로그인시 세션을 검사해서 user 정보가 있을 경우 로그인 처리하고, 없을경우 로그인 페이지로 리다이렉트 한다.

  var member = req.body.member;
  console.log(member);

  memberService.signin(member.id, member.password)
    .then(function (data) {
      console.log(data);

      if (data.length) {

        //세션 데이터 저장
        req.session.member = data;

        res.send(data);
        return;
      }
      else {
        console.log("id와 비밀번호를 확인해주세요.");
        res.send('login 실패');
        return;
      }
    })
    .catch(function (error) {
      console.log(error);
      res.send('서버 오류');
      return;
    });
});

/**
 * 2. 회원가입
 */
router.post('/signup', function (req, res, next) {

  var member = req.body.member;
  console.log(member);

  memberService.memberIdOrNickNameDuplicationCheck(member.id, member.nickname)
    .then(function (data) {
      console.log(data);
      if (!data.length) {
        console.log("회원가입 진행");

        // test code
        // var ggg = base64Encode('/Users/leedu/nohandphone-app/server/public/images/icon.png');
        // console.log(ggg);

        // 1. 이미지서버에 프로필 사진 저장
        base64Decode(member.profile_image_data, profileImagePath + member.member_id + ".png");
        member.profile_image_url = profileImagePath + member.member_id + ".png";

        // 2. 회원정보 db에 저장
        memberService.signup(member)
          .then(function (data) {

            //세션 데이터 저장
            req.session.member = member;

            res.send('회원가입 성공');
            return;
          })
          .catch(function (error) {
            console.log("signup error");
            console.log(error);
            return;
          });
      }
      else {
        for (var i = 0; i < data.length; i++) {
          if (data[i].member_id == member.id) {
            console.log("id가 중복됩니다.");
            res.send('id가 중복됩니다.');
            return;
          }
          else {
            console.log("nickname이 중복됩니다.");
            res.send('nickname이 중복됩니다.');
            return;
          }
        }
      }
    })
    .catch(function (error) {
      console.log("memberIdOrNickNameDuplicationCheck error");
      console.log(error);
      return;
    });
});

/**
 * 3. 프로필 조회
 */
router.get('/profile', function (req, res, next) {

  //console.log(req.sessionID);
  memberService.getProfile(req.sessionID)
    .then(function (data) {
      console.log(data);

      if (!data.length) {
        res.send('프로필 조회 실패');
        return;
      }

      res.send(data);
      return;
    })
    .catch(function (error) {
      console.log(error);
      res.send('프로필 조회 실패');
      return;
    });
});

/**
 * 4. 프로필 수정
 */
router.post('/profile/edit', function (req, res, next) {

  var newMember = req.body.member;

  memberService.getSession(req.sessionID)
    .then(function (data) {
      console.log(data);
      // res.send(data[0].sess.member[0]);
      console.log(data[0].sess.member);
      var originMember = data[0].sess.member;

      console.log(data[0].sess.member[0]);

      console.log("originMember: ", originMember);
      console.log("newMember: ", newMember);

      if(!originMember) {
        console.log("세션정보 가져오기 실패");
        //todo : 로그인페이지로 넘기기
        res.send("프로필 수정 실패");
        return;
      }

      memberService.editProfile(originMember, newMember)
        .then(function (data) {

        if(newMember.nick_name != null) {
            originMember.nick_name = newMember.nick_name;
        }

        if(newMember.password != null) {
            originMember.password = newMember.password;
        }
          //세션정보 수정
          req.session.member = originMember;

          res.send("프로필 수정 성공");
          return;
        })
        .catch(function (error) {
          console.log(error);
          res.send("프로필 수정 실패");
          return;
        });
    })
    .catch(function (error) {
      res.send("프로필 수정 실패");
      console.log(error);
      return;
    });
});

/**
 * 5. 프로필 사진 변경
 */
router.get('/profile/image/edit', function (req, res, next) {
  var member =req.body.member;
  
  try {
    // 1. 이미지서버에 프로필 사진 저장
    base64Decode(member.profile_image_data, profileImagePath + member.member_id + ".png");
  }
  catch(error) {
    console.log(error);
    return;
  }

  res.send('profile image edit');
});

/**
 * 6. 비밀번호 변경
 */
router.get('/password/change', function (req, res, next) {

  var newPassword = req.body.member.password;

  memberService.getSession(req.sessionID)
    .then(function (data) {
      console.log(data);
      // res.send(data[0].sess.member[0]);
      var originMember = data[0].sess.member;

      console.log(data[0].sess.member[0]);

      console.log("originMember: ", originMember);
      console.log("newMember: ", newMember);

      if(!originMember) {
         console.log("세션정보 가져오기 실패");
        //todo : 로그인페이지로 넘기기
        res.send("비밀번호 변경 실패");
        return;       
      }

      memberService.changePassword(originMember, newPassword)
        .then(function(data) {
          res.send("비밀번호 변경 성공");
          return;
        })
        .catch(function(error) {
          console.log(error);
          res.send("비밀번호 변경실패");
          return;
        });
    })
    .catch(function (error) {
      res.send("비밀번호 변경 실패");
      console.log(error);
      return;
    });
});

/**
 * 7. 비밀번호 찾기
 */
router.get('/password/find', function (req, res, next) {
  res.send('password find');
});

/**
 * 8. My no handphone (나의 총 사용 시간, 일주일 시간, 하루 시간)  
 */
router.get('/report', function (req, res, next) {

  memberService.getSession(req.sessionID)
    .then(function (data) {
      console.log(data);
      // res.send(data[0].sess.member[0]);
      var member = data[0].sess.member;

      console.log(data[0].sess.member[0]);

      if(!member) {
         console.log("세션정보 가져오기 실패");
        //todo : 로그인페이지로 넘기기
        res.send("비밀번호 변경 실패");
        return;       
      }

      memberService.getReport(member.nophone_id)
        .then(function(data) {
          res.send(data);
          return data;
        })
        .catch(function(error) {
          console.log(error);
          res.send(error);
          return error;
        });
    })
    .catch(function (error) {
      res.send("비밀번호 변경 실패");
      console.log(error);
      return;
    });
});

// test code
// function to encode file data to base64 encoded string
function base64Encode(file) {
  try {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
  }
  catch (error) {
    console.log('failed to base64Encode');
    return;
  }
}

// function to create file from base64 encoded string
function base64Decode(base64str, file) {
  try {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
  }
  catch (error) {
    console.log('failed to base64Decode');
    console.log(error);
    return;
  }
}

module.exports = router;
