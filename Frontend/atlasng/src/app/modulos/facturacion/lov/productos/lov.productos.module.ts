import { NgModule } from '@angular/core';
import { SharedModule } from 'app/util/shared/shared.module';
import { LovProductosRoutingModule } from './lov.productos.routing';

import { LovProductosComponent } from './componentes/lov.productos.component';


@NgModule({
    imports: [SharedModule, LovProductosRoutingModule],
    declarations: [LovProductosComponent],
    exports: [LovProductosComponent]
})
export class LovProductosModule { }

