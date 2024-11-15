import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { HorariosRoutingModule } from './horarios.routing';

import { HorariosComponent } from './componentes/horarios.component';
import { LovCatalogosModule } from '../../../generales/lov/catalogos/lov.catalogos.module';
import { LovHorarioModule } from '../../lov/horario/lov.horario.module';

import { HorarioPadreComponent } from './componentes/_horarioPadre.component';
import { HorarioDetalleComponent } from './componentes/_horarioDetalle.component';


@NgModule({
  imports: [SharedModule, HorariosRoutingModule, LovHorarioModule ],
  declarations: [HorariosComponent, HorarioPadreComponent, HorarioDetalleComponent]
})
export class HorariosModule { }
