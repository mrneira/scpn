import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CostoAmortizadoComponent } from './componentes/costoamortizado.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { CostoAmortizadoRoutingModule } from './costoamortizado.routing';
import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';

@NgModule({
  imports: [SharedModule, CostoAmortizadoRoutingModule, JasperModule, SpinnerModule, LovInversionesModule ],
  declarations: [CostoAmortizadoComponent]
})
export class CostoAmortizadoModule { }
