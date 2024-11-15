import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CargarDescuentosRoutingModule } from './cargarDescuentos.routing';
import { CargarDescuentosComponent } from './componentes/cargarDescuentos.component';
import { DescuentosArchivoComponent } from './componentes/_descuentosArchivo.component';
import { FileUploadModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, CargarDescuentosRoutingModule, FileUploadModule],
  declarations: [CargarDescuentosComponent, DescuentosArchivoComponent],
  exports: [DescuentosArchivoComponent]
})
export class CargarDescuentosModule { }
