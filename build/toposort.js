/****
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Gustavo Henke and Aaron Trent
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 ****/
(function( global, factory ) {
    if( typeof define === 'function' && define.amd ) {
        define( ['exports', 'module'], factory );
    } else if( typeof exports !== 'undefined' && typeof module !== 'undefined' ) {
        factory( exports, module );
    } else {
        var mod = {
            exports: {}
        };
        factory( mod.exports, mod );
        global.toposort = mod.exports;
    }
})( this, function( exports, module ) {
    /**
     * Created by Aaron on 7/28/2015.
     */

    'use strict';

    function _classCallCheck( instance, Constructor ) {
        if( !(instance instanceof Constructor) ) {
            throw new TypeError( 'Cannot call a class as a function' );
        }
    }

    var Toposort = (function() {
        function Toposort() {
            _classCallCheck( this, Toposort );

            this.edges = [];
        }

        /**
         * Adds dependency edges.
         *
         * @since   0.1.0
         * @param   {String} item               An dependent name. Must be an string and not empty
         * @param   {String[]|String} [deps]    An dependency or array of dependencies
         * @returns {Toposort}                  The Toposort instance
         */

        Toposort.prototype.add = function add( item, deps ) {
            if( typeof item !== 'string' || !item ) {
                throw new TypeError( 'Dependent name must be given as a not empty string' );
            }

            deps = Array.isArray( deps ) ? deps : [deps];

            if( deps.length > 0 ) {
                for( var _iterator = deps, _isArray = Array.isArray( _iterator ), _i = 0, _iterator = _isArray ?
                                                                                                      _iterator :
                                                                                                      _iterator[Symbol.iterator](); ; ) {
                    var _ref;

                    if( _isArray ) {
                        if( _i >= _iterator.length ) {
                            break;
                        }
                        _ref = _iterator[_i++];
                    } else {
                        _i = _iterator.next();
                        if( _i.done ) {
                            break;
                        }
                        _ref = _i.value;
                    }

                    var dep = _ref;

                    if( typeof dep !== 'string' || !dep ) {
                        throw new TypeError( 'Dependency name must be given as a not empty string' );
                    }

                    this.edges.push( [item, dep] );
                }
            } else {
                this.edges.push( [item] );
            }

            return this;
        };

        /**
         * Runs the toposorting and return an ordered array of strings
         *
         * @since   0.1.0
         * @returns {String[]}  The list of items topologically sorted.
         */

        Toposort.prototype.sort = function sort() {
            var _this = this;

            var nodes = [];
            var sorted = [];

            for( var _iterator2 = this.edges, _isArray2 = Array.isArray( _iterator2 ), _i2 = 0, _iterator2 = _isArray2 ?
                                                                                                             _iterator2 :
                                                                                                             _iterator2[Symbol.iterator](); ; ) {
                var _ref2;

                if( _isArray2 ) {
                    if( _i2 >= _iterator2.length ) {
                        break;
                    }
                    _ref2 = _iterator2[_i2++];
                } else {
                    _i2 = _iterator2.next();
                    if( _i2.done ) {
                        break;
                    }
                    _ref2 = _i2.value;
                }

                var edge = _ref2;

                for( var _iterator3 = edge, _isArray3 = Array.isArray( _iterator3 ), _i3 = 0, _iterator3 = _isArray3 ?
                                                                                                           _iterator3 :
                                                                                                           _iterator3[Symbol.iterator](); ; ) {
                    var _ref3;

                    if( _isArray3 ) {
                        if( _i3 >= _iterator3.length ) {
                            break;
                        }
                        _ref3 = _iterator3[_i3++];
                    } else {
                        _i3 = _iterator3.next();
                        if( _i3.done ) {
                            break;
                        }
                        _ref3 = _i3.value;
                    }

                    var node = _ref3;

                    if( nodes.indexOf( node ) === -1 ) {
                        nodes.push( node );
                    }
                }
            }

            var visit = function visit( node, i ) {
                var predecessors = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

                var index = undefined,
                    copy = undefined;

                if( predecessors.indexOf( node ) > -1 ) {
                    throw new Error( 'Cyclic dependency found. ' + node + ' is dependent of itself.\nDependency chain: '
                                     + predecessors.join( ' -> ' ) + ' => ' + node );
                }

                index = nodes.indexOf( node );
                if( index === -1 ) {
                    return i;
                }

                nodes.splice( index, 1 );
                if( predecessors.length === 0 ) {
                    i--;
                }

                copy = predecessors.slice();
                copy.push( node );

                for( var _iterator4 = _this.edges, _isArray4 = Array.isArray( _iterator4 ), _i4 = 0, _iterator4 = _isArray4 ?
                                                                                                                  _iterator4 :
                                                                                                                  _iterator4[Symbol.iterator](); ; ) {
                    var _ref4;

                    if( _isArray4 ) {
                        if( _i4 >= _iterator4.length ) {
                            break;
                        }
                        _ref4 = _iterator4[_i4++];
                    } else {
                        _i4 = _iterator4.next();
                        if( _i4.done ) {
                            break;
                        }
                        _ref4 = _i4.value;
                    }

                    var edge = _ref4;

                    if( edge[0] === node ) {
                        i = visit( edge[1], i, copy );
                    }
                }
                sorted.unshift( node );
                return i;
            };

            for( var i = 0; i < nodes.length; i++ ) {
                i = visit( nodes[i], i );
            }

            return sorted;
        };

        /**
         * Clears edges
         *
         * @since   0.1.0
         * @returns {Toposort}                  The Toposort instance
         */

        Toposort.prototype.clear = function clear() {
            this.edges = [];

            return this;
        };

        return Toposort;
    })();

    module.exports = Toposort;
} );
