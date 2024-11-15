import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { EvaluacionPatrimonioRoutingModule } from './evaluacionpatrimonio.routing';
import { EvaluacionPatrimonioComponent } from './componentes/evaluacionpatrimonio.component';
import { TooltipModule} from 'primeng/primeng'
import { JasperModule } from '../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [
    SharedModule, 
    EvaluacionPatrimonioRoutingModule, 
    TooltipModule,JasperModule ],
  declarations: [EvaluacionPatrimonioComponent],
  exports: [EvaluacionPatrimonioComponent]
})
export class EvaluacionPatrimonioModule { }
