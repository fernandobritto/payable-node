<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('v1')->namespace('Api')->group(function(){
    Route::name('real_states.')->group(function(){
        Route::resource('real-states', 'RealStateController');
    });
});
