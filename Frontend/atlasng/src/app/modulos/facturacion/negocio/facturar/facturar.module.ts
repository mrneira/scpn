import { NgModule } from '@angular/core';
import { SharedModule } from 'app/util/shared/shared.module';
import { FacturarRoutingModule } from './facturar.routing';

import { FacturarComponent } from './componentes/facturar.component';
import { FacturaDetalleComponent } from './componentes/facturaDetalle.component';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';
import { LovPersonasModule } from 'app/modulos/personas/lov/personas/lov.personas.module';
import { LovFormaPagoModule } from '../../lov/formapago/lov.formaPago.module';
import { LovClienteModule } from '../../lov/cliente/lov.cliente.module';
import { FacturaFormaPagoComponent } from './componentes/formaPago.component';

@NgModule({
    imports: [SharedModule, FacturarRoutingModule, LovProductosModule, LovPersonasModule, LovFormaPagoModule, LovClienteModule],
    declarations: [FacturarComponent, FacturaDetalleComponent, FacturaFormaPagoComponent]
})
export class FacturarModule { }
