import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { TareasModuloLoteRoutingModule } from './_tareasModuloLote.routing';

import { TareasModuloLoteComponent } from './componentes/_tareasModuloLote.component';
import { LovModuloTareasModule } from '../../../../lov/modulotareas/lov.moduloTareas.module';

@NgModule({
  imports: [SharedModule, TareasModuloLoteRoutingModule, LovModuloTareasModule],
  declarations: [TareasModuloLoteComponent],
  exports: [TareasModuloLoteComponent]
})
export class TareasModuloLoteModule { }
