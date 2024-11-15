import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ActaDevolucionBienesRoutingModule } from './actaDevolucionBienes.routing';
import { ActaDevolucionBienesComponent } from './componentes/actaDevolucionBienes.component';
import { LovDevolucionesModule } from '../../lov/devoluciones/lov.devoluciones.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, ActaDevolucionBienesRoutingModule,LovDevolucionesModule,TooltipModule],
  declarations: [ActaDevolucionBienesComponent]
})
export class ActaDevolucionBienesModule { }
