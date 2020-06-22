@extends('layouts.app')

@section('content')
<div class="container col-md-7">

    <div class="list-group">
    @foreach ($files as $item)
        <a href="#" class="list-group-item list-group-item-action flex-column align-items-start ">
            <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">{{ $item->name }}</h5>

            <small>
                <button type="button" class="btn btn-success">Editar</button>
                <button type="button" class="btn btn-danger">Deletar</button>
                <small>
                    <button type="button" class="btn btn-secondary">Baixar arquivo CSV</button>
                </small>
            </small>
            </div>
            <p class="mb-1">{{ $item->address }}</p>
            <small>{{ $item->zipcode }}</small>
      </a>
      <br>
      <br>
      <br>

    @endforeach
    </div>


</div>
@endsection
