@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header">Dashboard Comma-separated values</div>

                <div class="card-body">
                    <div class="card-deck">
                        <div class="col-sm-4">

                            <img src="assets/img_home.png" alt="" width="100%" height="250px">

                        </div>
                        <div class="card">
                            <img class="card-img-top" src="holder.js/100x180/" alt="">
                            <div class="card-body">
                                <h4 class="card-title">Title</h4>
                                <a href="#" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">Ver lista de CSVs</a>
                                <a href="#" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">Criar um novo CSV</a>
                                <a href="#" class="btn btn-secondary btn-lg active" role="button" aria-pressed="true">Fazer Upload</a><br><br>
                                <p>Os arquivos Comma-separated values, também conhecido como CSV, são arquivos de texto de formato regulamentado pelo RFC 4180, que faz uma ordenação de bytes ou um formato de terminador de linha, separando valores com vírgulas. Ele comumente é usado em softwares offices, tais como o Microsoft Excel e o LibreOffice Calc</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="card csv_upload">
                <div class="card-header">
                    <h4> Faça o Upload do seu Arquivo .CSV aqui</h4>
                </div>
                <div class="card-body">
                    <form action="upload" method="post" accept-charset="UTF-8" enctype="multipart/form-data">
                        {{ csrf_field() }}
                        <input type="file" name="csv" id="" />
                        <button type="submit" class="btn btn-success btn-lg active">Enviar</button>
                    </form>
                </div>
            </div>

        </div>
    </div>
</div>
@endsection
