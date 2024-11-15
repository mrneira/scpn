import { NgModule } from '@angular/core';
import { SharedModule } from 'app/util/shared/shared.module';
import { CategoriasRoutingModule } from './categorias.routing';

import { CategoriasComponent } from './componentes/categorias.component';
import { AccionesArbolModule } from 'app/util/componentes/accionesarbol/accionesArbol.module';
import { TreeTableModule, SelectButtonModule } from 'primeng/primeng';
import { LovTransaccionesModule } from 'app/modulos/generales/lov/transacciones/lov.transacciones.module';

@NgModule({
    imports: [SharedModule, CategoriasRoutingModule, AccionesArbolModule, TreeTableModule, LovTransaccionesModule, SelectButtonModule],
    declarations: [CategoriasComponent]
})
export class CategoriasModule { }
