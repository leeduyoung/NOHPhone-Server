var pgp = require('pg-promise')();
var dbConfig = require('../../db-config.js');
var db = pgp(dbConfig.connection);

let commonService = {
    getTotalRanker: getTotalRanker, //전체 랭커 (1~3)
    getOneWeekRanker: getOneWeekRanker, //주간 랭커
    getOneDayRanker: getOneDayRanker //일일 랭커
};

let query;

function getTotalRanker() {
    console.log("getTotalRanker");
    return new Promise(function(resolve, reject) {
        query = 'SELECT * FROM nophone LEFT JOIN member ON nophone.nophone_id = member.nophone_id ORDER BY total DESC limit 3';
        db.query(query)
            .then(function(data) {
                resolve(data);
            })
            .catch(function(error) {
                reject(error);
            });
    });
}

function getOneWeekRanker() {
    console.log("getWeekRanker");
    return new Promise(function(resolve, reject) {
        query = 'SELECT * FROM nophone LEFT JOIN member ON nophone.nophone_id = member.nophone_id ORDER BY week DESC limit 3';
        db.query(query)
            .then(function(data) {
                resolve(data);
            })
            .catch(function(error) {
                reject(error);
            });
    });
}

function getOneDayRanker() {
    console.log("getWeekRanker");
    return new Promise(function(resolve, reject) {
        query = 'SELECT * FROM nophone LEFT JOIN member ON nophone.nophone_id = member.nophone_id ORDER BY day DESC limit 3';
        db.query(query)
            .then(function(data) {
                resolve(data);
            })
            .catch(function(error) {
                reject(error);
            });
    });
}

module.exports = commonService;
