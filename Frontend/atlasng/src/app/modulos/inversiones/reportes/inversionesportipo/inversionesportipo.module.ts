import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { InversionesPorTipoRoutingModule } from './inversionesportipo.routing';
import { InversionesPorTipoComponent } from './componentes/inversionesportipo.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, InversionesPorTipoRoutingModule, JasperModule, SpinnerModule ],
  declarations: [InversionesPorTipoComponent]
})
export class InversionesPorTipoModule { }
