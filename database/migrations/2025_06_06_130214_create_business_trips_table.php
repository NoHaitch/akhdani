<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('perjalanan_dinas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('maksud_tujuan');             // purpose
            $table->date('tanggal_berangkat');
            $table->date('tanggal_pulang');
            $table->foreignId('kota_asal_id')->constrained('kotas')->onDelete('restrict');
            $table->foreignId('kota_tujuan_id')->constrained('kotas')->onDelete('restrict');
            $table->integer('durasi_hari');
            $table->decimal('uang_saku_per_hari', 12, 2);
            $table->decimal('total_uang_saku', 12, 2);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('disetujui_oleh')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('tanggal_disetujui')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_trips');
    }
};
