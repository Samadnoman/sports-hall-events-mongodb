"""Check every simple query (Q1-Q35) against the dataset without a MongoDB server.

Reads the queries from queries/mongo_shell_queries.js, evaluates each
countDocuments() filter against data/sports_hall_events.json, and compares
the result with the "Expected: N documents" comment for that query.

Run from the repository root:  python scripts/verify_query_counts.py
"""
import json,re,sys
data=json.load(open('data/sports_hall_events.json'))
js=open('queries/mongo_shell_queries.js').read()
def get(doc,path):
    cur=[doc]
    for p in path.split('.'):
        nxt=[]
        for c in cur:
            if isinstance(c,dict) and p in c: nxt.append(c[p])
        cur=nxt
    return cur
def match_val(v,cond):
    if isinstance(cond,dict) and any(k.startswith('$') for k in cond):
        for op,a in cond.items():
            if op=='$options': continue
            vals=v if isinstance(v,list) and op not in('$size','$all') else [v]
            if op=='$gt': ok=any(x>a for x in vals if isinstance(x,(int,float)))
            elif op=='$gte': ok=any(x>=a for x in vals if isinstance(x,(int,float)))
            elif op=='$lt': ok=any(x<a for x in vals if isinstance(x,(int,float)))
            elif op=='$lte': ok=any(x<=a for x in vals if isinstance(x,(int,float)))
            elif op=='$in': ok=any(x in a for x in vals)
            elif op=='$nin': ok=not any(x in a for x in vals)
            elif op=='$ne': ok=not any(x==a for x in vals)
            elif op=='$all': ok=isinstance(v,list) and all(x in v for x in a)
            elif op=='$size': ok=isinstance(v,list) and len(v)==a
            elif op=='$regex':
                fl=re.I if 'i' in cond.get('$options','') else 0
                ok=any(isinstance(x,str) and re.search(a,x,fl) for x in vals)
            else: raise Exception(op)
            if not ok: return False
        return True
    if isinstance(v,list) and not isinstance(cond,list): return cond in v
    return v==cond
def match(doc,f):
    for k,c in f.items():
        if k=='$and':
            if not all(match(doc,x) for x in c): return False
        elif k=='$or':
            if not any(match(doc,x) for x in c): return False
        else:
            vs=get(doc,k)
            if not vs:
                if isinstance(c,dict) and ('$nin' in c or '$ne' in c): continue
                return False
            if not match_val(vs[0],c): return False
    return True
def js2json(s):
    s=re.sub(r'\$regex:\s*/(.*?)/(\w*)', lambda m: f'"$regex":"{m.group(1)}","$options":"{m.group(2)}"', s)
    s=re.sub(r'([{,]\s*)(\$?\w+)\s*:', r'\1"\2":', s)
    return json.loads(s)
blocks=re.findall(r'// (Q\d+)\s.*?Expected: (\d+) documents.*?db\.Event\.countDocuments\(\s*(\{.*?\})\s*\)\s*\n', js, re.S)
ok=0
for q,exp,f in blocks:
    n=sum(match(d,js2json(f)) for d in data)
    flag='OK' if n==int(exp) else 'MISMATCH'
    if flag=='OK': ok+=1
    print(q,exp,n,flag)
print(ok,'/',len(blocks))
