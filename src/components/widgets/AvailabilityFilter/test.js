/* global describe, it */
import {expect} from 'chai';
import mockDOMSource from 'power-ui/test-utils/mock-dom-source';
import {Rx} from '@cycle/core';
import AvailabilityFilter from './index';

describe('AvailabilityFilter', () => {
  it('should be a function', () => {
    expect(AvailabilityFilter).to.be.a('function');
  });

  it('should apply props value to the <input>', (done) => {
    const props$ = Rx.Observable.just({value: 18});
    const DOMSource = mockDOMSource();
    const availabilityFilter = AvailabilityFilter({DOM: DOMSource, props$});
    availabilityFilter.DOM.elementAt(0).subscribe(vtree => {
      expect(vtree).to.be.an('object');
      expect(vtree.children).to.be.an('array');
      expect(vtree.children[1]).to.be.an('object');
      expect(vtree.children[1].tagName).to.be.equal('INPUT');
      expect(vtree.children[1].properties).to.be.an('object');
      expect(vtree.children[1].properties['data-hook'].injectedText)
        .to.be.equal('18');
      done();
    });
  });

  it('should set <input> to zero if props value was invalid', (done) => {
    const props$ = Rx.Observable.just({value: '!'});
    const DOMSource = mockDOMSource();
    const availabilityFilter = AvailabilityFilter({DOM: DOMSource, props$});
    availabilityFilter.DOM.elementAt(0).subscribe(vtree => {
      expect(vtree).to.be.an('object');
      expect(vtree.children).to.be.an('array');
      expect(vtree.children[1]).to.be.an('object');
      expect(vtree.children[1].tagName).to.be.equal('INPUT');
      expect(vtree.children[1].properties).to.be.an('object');
      expect(vtree.children[1].properties['data-hook'].injectedText)
        .to.be.equal('0');
      done();
    });
  });

  it('should replace invalid value with zero on <input>', (done) => {
    const props$ = Rx.Observable.just({value: 18});
    const DOMSource = mockDOMSource({
      '.AvailabilityFilter input': {
        'change': Rx.Observable.just({target: {value: 'x'}}),
      },
    });
    const availabilityFilter = AvailabilityFilter({DOM: DOMSource, props$});
    availabilityFilter.DOM.elementAt(1).subscribe(vtree => {
      expect(vtree).to.be.an('object');
      expect(vtree.children).to.be.an('array');
      expect(vtree.children[1]).to.be.an('object');
      expect(vtree.children[1].tagName).to.be.equal('INPUT');
      expect(vtree.children[1].properties).to.be.an('object');
      expect(vtree.children[1].properties['data-hook'].injectedText)
        .to.be.equal('0');
      done();
    });
  });
});
