import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovModuloTareasRoutingModule } from './lov.moduloTareas.routing';

import { LovModuloTareasComponent } from './componentes/lov.moduloTareas.component';
import { ModulosModule } from '../../../generales/modulos/modulos.module';

@NgModule({
  imports: [SharedModule, LovModuloTareasRoutingModule, ModulosModule],
  declarations: [LovModuloTareasComponent],
  exports: [LovModuloTareasComponent]
})
export class LovModuloTareasModule { }

