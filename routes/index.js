var express = require('express');
var router = express.Router();

var pgp = require('pg-promise')();
var dbConfig = require('../db-config.js');
var db = pgp(dbConfig.connection);

var memberService = require('./services/memberService.js'); //member서비스
var commonService = require('./services/commonService.js'); //common서비스

/**
 * 전체 랭킹 조회
 */
router.get('/total', function (req, res, next) {
    
    // 1. no_handphone 테이블에서 total 컬럼(총 핸드폰 사용안한시간)에서 최대값 3개 추출
    // 2. 3개에 해당하는 user 정보를 member 테이블에서 추출

    commonService.getTotalRanker()
        .then(function(data) {
            console.log(data);

            if(!data.length) {
                console.log("전체 랭킹 조회 실패");
                res.send("전체 랭킹 조회 실패");
                return;
            }

            res.send(data);
            return;
        })
        .catch(function(error) {
            console.log("전체 랭킹 조회 실패");
            console.log(error);
            res.send("전체 랭킹 조회 실패");
            return;
        });
});

/**
 * 일주일 랭킹 조회
 */
router.get('/oneweek', function (req, res, next) {

    commonService.getOneWeekRanker()
        .then(function(data) {
            console.log(data);

            if(!data.length) {
                console.log("주간 랭킹 조회 실패");
                res.send("주간 랭킹 조회 실패");
                return;                
            }
            res.send(data);
            return;
        })
        .catch(function(error) {
            console.log("주간 랭킹 조회 실패");
            console.log(error);
            res.send("주간 랭킹 조회 실패");
            return;
        });
});

/**
 * 하루 랭킹 조회
 */
router.get('/oneday', function (req, res, next) {
    
    commonService.getOneDayRanker()
        .then(function(data) {
            console.log(data);

            if(!data.length) {
                console.log("일간 랭킹 조회 실패");
                res.send("일간 랭킹 조회 실패");
                return;                
            }
            res.send(data);
            return;
        })
        .catch(function(error) {
            console.log("일간 랭킹 조회 실패");
            console.log(error);
            res.send("일간 랭킹 조회 실패");
            return;
        });
});

module.exports = router;
