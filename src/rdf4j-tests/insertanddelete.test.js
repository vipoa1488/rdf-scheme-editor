const data =
  '<http://exampleSub> <http://examplePred> <http://exampleObj>. ' +
  'GRAPH <urn:sparql:tests:insert:data> {' +
  '<http://exampleSub> <http://exampleSub> 100} ';
var params =
  'action=exec&' +
  'queryLn=SPARQL&' +
  'query=' +
  encodeURIComponent(
    'PREFIX foaf: <https://agentlab.ru/rdf4j-workbench/repositories> ' + 'SELECT ?Subject ' + 'WHERE{ ' + data + '}',
  ) +
  '&' +
  'limit_query=100&' +
  'infer=true&';

test('insert data to rdf repository with context', async () => {
  var urlprefix = 'https://agentlab.ru/rdf4j-workbench/repositories/rtrtrtr/query' + '?' + params;
  //проверка до добавления
  var dataSel = await fetch(urlprefix, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/sparql-results+json',
    },
  }).then((r) => r.json());
  //console.log('===================== ' + Object.keys(dataSel.results.bindings));
  expect(dataSel.results.bindings.length).toEqual(0);

  //добавление
  urlprefix = 'https://agentlab.ru/rdf4j-workbench/repositories/rtrtrtr/update';
  var result = await fetch(urlprefix, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/sparql-results+json',
    },
    body: 'update=' + encodeURIComponent('INSERT DATA' + '{' + data + '}'),
  }).then((r) => {
    console.log(r);
    expect(r).toBeInstanceOf(Response);
    expect(r['status']).toEqual(200);
    return r;
  });
});

test('check data after insert to rdf repository with context', async () => {
  //проверка после
  var urlprefix = 'https://agentlab.ru/rdf4j-workbench/repositories/rtrtrtr/query' + '?' + params;
  var dataSel = await fetch(urlprefix, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/sparql-results+json',
    },
  }).then((r) => r.json());
  //console.log('===================== ' + Object.keys(dataSel.results.bindings));
  expect(dataSel.results.bindings.length).toBeGreaterThan(0);
});

test('delete data to rdf repository with context', async () => {
  var urlprefix = 'https://agentlab.ru/rdf4j-workbench/repositories/rtrtrtr/query' + '?' + params;
  //проверка до
  var dataSel = await fetch(urlprefix, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/sparql-results+json',
    },
  }).then((r) => r.json());
  expect(dataSel.results.bindings.length).toBeGreaterThan(0);

  //удаление
  urlprefix = 'https://agentlab.ru/rdf4j-workbench/repositories/rtrtrtr/update';
  var result = await fetch(urlprefix, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/sparql-results+json',
    },
    body: 'update=' + encodeURIComponent('DELETE DATA' + '{' + data + '}'),
  }).then((r) => {
    console.log(r);
    expect(r).toBeInstanceOf(Response);
    expect(r['status']).toEqual(200);
    return r;
  });

  //проверка после
  dataSel = await fetch(urlprefix, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/sparql-results+json',
    },
  }).then((r) => r.json());
  //console.log('===================== ' + Object.keys(dataSel.results.bindings));
  expect(dataSel.results.bindings.length).toEqual(0);
});
