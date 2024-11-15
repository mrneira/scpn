import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DepreciacionAnulacionRoutingModule } from './depreciacionAnulacion.routing';
import { DepreciacionAnulacionComponent } from './componentes/depreciacionAnulacion.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovDepreciacionesModule } from '../../lov/depreciaciones/lov.depreciaciones.module';
import { LovProveedoresModule } from '../../../contabilidad/lov/proveedores/lov.proveedores.module';

@NgModule({
  imports: [SharedModule, DepreciacionAnulacionRoutingModule, CabeceraModule, DetalleModule, JasperModule,LovDepreciacionesModule, LovProveedoresModule ],
  declarations: [DepreciacionAnulacionComponent]
})
export class DepreciacionAnulacionModule { }
