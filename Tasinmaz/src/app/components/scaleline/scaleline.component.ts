import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-scaleline',
  template: `
    <p>
      scaleline works!
    </p>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScalelineComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
