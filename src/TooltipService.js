import { Container, inject } from 'aurelia-dependency-injection';
import { Origin } from 'aurelia-metadata';
import { CompositionEngine, CompositionContext, Controller } from 'aurelia-templating';
import { invokeLifecycle } from './invokeLifecycle';
import { TooltipRenderer } from './TooltipRenderer';

interface TooltipSettings {
  viewModel: any,
  model: any,
  target?: Element,
}

@inject(Container, CompositionEngine, TooltipRenderer)
export class TooltipService {
  _container: Container;
  _compositionEngine: CompositionEngine;
  _renderer: TooltipRenderer;

  constructor(container: Container, compositionEngine: CompositionEngine, renderer: TooltipRenderer) {
    this._container = container;
    this._compositionEngine = compositionEngine;
    this._renderer = renderer;
  }

  _viewModel: {};
  _model: any;
  _controller: Controller;

  show(settings: TooltipSettings) {
    const { _container: container } = this;
    const { target, model, viewModel: tempViewModel } = settings;
    const viewModel = Origin.get(tempViewModel).moduleId;

    const instructions: CompositionContext = {
      container,
      model,
      viewModel,
    };

    this._viewModel = viewModel;
    this._model = model;

    invokeLifecycle(viewModel, 'canActivate', model)
      .then(canActivate => {
        if (canActivate) {
          this._compositionEngine.createController(instructions)
            .then(controller => {
              controller.automate();
              this._controller = controller;

              this._renderer.show(controller.view, target);
            });
        }
      });
  }

  hide() {
    invokeLifecycle(this._viewModel, 'canDeactivate', this._model)
      .then(canDeactivate => {
        if (canDeactivate) {
          this._renderer.hide();
        }
      });
  }
}
