<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CsvFile extends Model
{
    protected $fillable = ['music', 'singer', 'genre' ];

    public $timestamps = false;
}
