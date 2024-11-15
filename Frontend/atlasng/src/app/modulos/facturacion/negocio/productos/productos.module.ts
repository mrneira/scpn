import { NgModule } from '@angular/core';
import { SharedModule } from 'app/util/shared/shared.module';
import { ProductosRoutingModule } from './productos.routing';

import { ProductosComponent } from './componentes/productos.component';
import { LovCategoriasModule } from '../../lov/categorias/lov.categorias.module';
import { LovImpuestoModule } from '../../lov/impuesto/lov.impuesto.module';
import { LovCuentasContablesModule } from 'app/modulos/contabilidad/lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
    imports: [SharedModule, ProductosRoutingModule, LovCuentasContablesModule, LovCategoriasModule, LovImpuestoModule],
    declarations: [ProductosComponent]
})
export class ProductosModule { }
