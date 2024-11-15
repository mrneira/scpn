import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { DevolverGarantiaFPCRoutingModule } from './devolvergarantiafpc.routing';
import { DevolverGarantiaFPCComponent } from './componentes/devolvergarantiafpc.component';
import { LovClientesModule } from '../../../lov/clientes/lov.clientes.module';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

@NgModule({
    imports: [SharedModule, DevolverGarantiaFPCRoutingModule, LovClientesModule, JasperModule],
    declarations: [DevolverGarantiaFPCComponent]
})
export class DevolverGarantiaFPCModule { }
