var pgp = require('pg-promise')();
var dbConfig = require('../../db-config.js');
var db = pgp(dbConfig.connection);

let memberService = {
    getSession: getSession, //세션정보
    signin: signin, //로그인
    signup: signup, //회원가입
    memberIdOrNickNameDuplicationCheck: memberIdOrNickNameDuplicationCheck, //멤버아이디, 닉네임 중복체크
    getProfile: getProfile,                 //프로필 조회
    editProfile: editProfile,               //프로필 수정
    //editProfileImage: editProfileImage,     //프로필 이미지 수정
    changePassword: changePassword,         //비밀번호 변경
    // findPassword: findPassword              //비밀번호 찾기
    getReport: getReport                       //내 핸드폰 사용현황 조회
};

let query;

function getSession(sessionID) {
    console.log("getSession");
    return new Promise(function(resolve, reject) {
        query = 'SELECT * FROM session WHERE sid = $1';
        db.query(query, sessionID)
            .then(function(data) {
                resolve(data);
            })
            .catch(function(error) {
                reject(error);
            });
    });
}

function signin(memberId, password) {
    console.log("로그인");
    return new Promise(function(resolve, reject) {
        query = 'SELECT * FROM member WHERE member_id = $1 AND password = $2';
        db.query(query, [memberId, password])
            .then(function(data) {
                resolve(data);
            })
            .catch(function(error) {
                reject(error);
            });
    });
}

function signup(member) {
    console.log("회원가입");
    console.log(member);
    return new Promise(function(resolve, reject) {
        query = 'INSERT INTO member(member_id, nick_name, enable, profile_image_url) VALUES(${id},${nickname},${enable},${profile_image_url})';
        db.query(query, member)
            .then(function(data) {
                resolve(data);         
            })
            .catch(function(error) {
                reject(error);
            });          
    });
}

function memberIdOrNickNameDuplicationCheck(memberId, nickName) {
    console.log("memberIdOrNickNameDuplicationCheck");
    return new Promise(function(resolve, reject) {
        query = 'SELECT member_id, nick_name FROM member WHERE member_id = $1 OR nick_name = $2';
        db.query(query, [memberId, nickName])
            .then(function(data) {
                resolve(data);
            })
            .catch(function(error) {
                reject(error);
            });
    });
}

function getProfile(sessionID) {
    console.log("프로필 조회");
    return new Promise(function(resolve, reject) {
        query = 'SELECT * FROM session WHERE sid = $1';
        db.query(query, sessionID)
            .then(function(data) {
                resolve(data);
            })
            .catch(function(error) {
                reject(error);
            });
    });    
}

function editProfile(originMember, newMember) {
    console.log("프로필 수정");
    return new Promise(function(resolve, reject) {

        if(newMember.nickname != null) {
            console.log("originMember.nick_name : ", originMember.nick_name);
            console.log("newMember.nickname : ", newMember.nickname);
            originMember.nick_name = newMember.nickname;
            console.log("originMember.nickname : ", originMember.nick_name);
        }

        if(newMember.password != null) {
            originMember.password = newMember.password;
        }

        query = 'UPDATE member SET nick_name=$1, enable=$2, password=$3 WHERE member_id=$4';
        db.query(query, [originMember.nick_name, originMember.enable, originMember.password, originMember.member_id])
            .then(function(data) {
                resolve(data);
            })
            .catch(function(error) {
                reject(error);
            });
    });    
}

function getReport(nophoneId) {
    console.log("내 사용시간 조회");
    return new Promise(function(resolve, reject) {
        query = 'SELECT * FROM nophone WHERE nophone_id = $1';
        db.query(query, nophoneId)
            .then(function(data) {
                resolve(data);
            })
            .catch(function(error) {
                reject(error);
            });
    });    
}

function changePassword(originMember, newPassword) {
    console.log("비밀번호 변경");
    return new Promise(function(resolve, reject) {

        originMember.password = newPassword;
        query = 'UPDATE member SET password=$1 WHERE member_id=$2';
        db.query(query, [originMember.password, originMember.member_id])
            .then(function(data) {
                resolve(data);
            })
            .catch(function() {
                reject(error);
            });
    });
}

module.exports = memberService;
