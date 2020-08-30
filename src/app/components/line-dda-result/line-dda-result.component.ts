import { Component, Input } from '@angular/core';
import { DdaMetadata } from '../../types/lines';

@Component({
    selector: 'app-line-dda-result',
    templateUrl: './line-dda-result.component.html',
    styleUrls: ['./line-dda-result.component.scss'],
})
export class LineDdaResultComponent {
    @Input()
    public metadata: DdaMetadata;
}
