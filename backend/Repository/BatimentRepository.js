/**
 * Created by angem on 2017-04-22.
 */

var mySqlCOnnection = require ('../Repository/DBconnection')
var EventEmitter = require('events').EventEmitter;
var batimentRepositoryEvent = new EventEmitter();
var _ = require('lodash');

