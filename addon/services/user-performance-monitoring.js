import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { computed } from '@ember/object';
import ttiPolyfill from 'tti-polyfill';

export default Service.extend(Evented, {
  _onEvent(eventName, eventDetails) {
    this.trigger('timingEvent', eventName, eventDetails);
  },

  _config: computed(function() {
    return getOwner(this).resolveRegistration('config:environment')['ember-user-performance-monitoring'];
  }),

  listen() {
    const callbackClosure = (eventName, e) => {
      this._onEvent(eventName, e);
    };

    if (window.__emberUserPerf && !window.__emberUserPerfCallback) {
      window.__emberUserPerfCallback = callbackClosure;

      Object.entries(window.__emberUserPerf).forEach(([key, value]) => {
        callbackClosure(key, value);
      });
    }

    if (this._config.observeTTI) {
      const opts = {} || this._config.observeTTI.options;
      ttiPolyfill.getFirstConsistentlyInteractive(opts).then((tti) => {
        callbackClosure('tti', tti);
      });
    }
  }
});
