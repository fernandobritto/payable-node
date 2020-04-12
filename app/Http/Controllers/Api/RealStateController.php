<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RealStateController extends Controller
{
    private $realState;

    public function __construct(RealState $realState)
    {
      $this->RealState = $realState;
    }
}
