<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Csv extends Model
{
    protected $fillable=[
        'name', 'email', 'address', 'zipcode'
    ];
}
