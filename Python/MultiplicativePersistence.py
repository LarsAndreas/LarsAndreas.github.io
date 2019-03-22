def grow(N):
    def factorize(q,tested):
        for x in range(2,q+1):
            if q % x == 0 and q != 1:
                if int(q/x) not in tested:
                    factor = factorize(int(q/x), tested)
                    factor.append(x)
                else:
                    return [q]
            else:
                return [q]
        else:
            return [q]
    tested = []
    factorizations = []
    for t in range(2,N+1):
        factorizations.append([t,factorize(t,tested)])
        tested.append(t)
    print(tested)
    print(factorizations)
grow(1000)