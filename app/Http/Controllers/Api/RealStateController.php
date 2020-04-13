<?php

namespace App\Http\Controllers\Api;

use App\RealState;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RealStateController extends Controller
{
    private $realState;

    public function __construct(RealState $realState)
    {
      $this->realState = $realState;
    }


}